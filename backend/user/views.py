from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import viewsets, status, generics, filters
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from .models import User
from .filters import UserFilter
from .pagination import StandardResultsSetPagination
from rest_framework.permissions import IsAuthenticated
from .serializers import UserRoleSerializer, UserRoleUpdateSerializer, UserCreateSerializer, UserProfileUpdateSerializer, PasswordChangeSerializer
from .decorators import permission_required
from django.utils.decorators import method_decorator
from django.utils import timezone
from rest_framework.views import APIView


class UserManagementViewSet(viewsets.ModelViewSet):
    queryset = User.objects.filter(deleted_at__isnull=True)
    serializer_class = UserRoleSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = StandardResultsSetPagination

    # Filters and ordering
    filter_backends = (DjangoFilterBackend, filters.OrderingFilter, filters.SearchFilter)
    filterset_class = UserFilter
    search_fields = ['name', 'username', 'email']
    ordering_fields = '__all__'
    ordering = ['id']  # Default ordering

    def get_serializer_class(self):
        if self.action == 'create':
            return UserCreateSerializer
        return UserRoleSerializer

    #------------------------------#
    # Seção de criação de usuários
    #------------------------------#
    @method_decorator(permission_required('users.create'))
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    #------------------------------#
    # Seção de listagem de usuários
    #------------------------------#
    def get_queryset(self):
        user = self.request.user
        user.last_access = timezone.now()
        user.save(update_fields=['last_access'])

        if user.role == 'administrator':
            return self.queryset
        elif user.role == 'manager':
            return self.queryset.filter(role__in=['operator', 'manager'])
        elif user.role == 'operator':
            return self.queryset.filter(id=user.id)
        else:
            return self.queryset.none()
        
    #------------------------------#
    # Seção de atualização de usuários
    #------------------------------#
    def update(self, request, *args, **kwargs):
        partial = True
        instance = self.get_object()

        if request.user.id == instance.id:
            return Response(
                {'error': 'Você não pode alterar seu próprio perfil através deste endpoint. Use o endpoint /api/me/.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        if 'role' in request.data:
            requested_new_role = request.data['role']
            user_being_updated_current_role = instance.role
            requesting_user = request.user

            if requesting_user.role in ['manager', 'operator']:
                return Response(
                    {'error': 'Você não tem permissão para alterar cargos.'},
                    status=status.HTTP_403_FORBIDDEN
                )

            if requesting_user.is_superuser:
                pass
            elif requesting_user.role == 'administrator':
                if user_being_updated_current_role == 'administrator' or requested_new_role == 'administrator':
                    return Response(
                        {'error': 'Administradores não podem alterar o cargo de outros administradores ou definir cargos como administrador.'},
                        status=status.HTTP_403_FORBIDDEN
                    )
            else:
                return Response(
                    {'error': 'Permissão negada para alterar o cargo.'},
                    status=status.HTTP_403_FORBIDDEN
                )
            
        if request.user.role == 'manager' and instance.role == 'manager' and request.user.id != instance.id:
            return Response(
                {'error': 'Gerentes não podem alterar dados de outros gerentes.'},
                status=status.HTTP_403_FORBIDDEN
            )
    
        if request.user.role == 'administrator' and instance.role == 'administrator' and request.user.id != instance.id:
            return Response(
                {'error': 'Administradores não podem alterar dados de outros administradores.'},
                status=status.HTTP_403_FORBIDDEN
            )    
            
        data_to_update = request.data.copy()

        serializer = UserRoleSerializer(instance, data=data_to_update, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        if getattr(instance, '_prefetched_objects_cache', None):
            instance._prefetched_objects_cache = {}

        return Response(serializer.data)
    
    #------------------------------#
    # Seção de troca de cargo de usuário
    #------------------------------#
    @action(detail=True, methods=['patch'])
    def change_role(self, request, pk=None):
        if request.user.role != 'administrator':
            return Response(
                {'error': 'Apenas administradores podem alterar cargos'}, 
                status=status.HTTP_403_FORBIDDEN
            )
        
        user = self.get_object()
        
        # Não permitir que o usuário altere seu próprio cargo
        if user.id == request.user.id:
            return Response(
                {'error': 'Você não pode alterar seu próprio cargo'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        serializer = UserRoleUpdateSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            
            # Retornar dados atualizados
            response_serializer = UserRoleSerializer(user)
            return Response({
                'message': f'Cargo do usuário {user.name} alterado para {user.get_role_display()}',
                'user': response_serializer.data
            })
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    #------------------------------#
    # Seção de listagem de cargos disponíveis
    #------------------------------#
    @action(detail=False, methods=['get'])
    def available_roles(self, request):
        if request.user.role != 'administrator':
            return Response(
                {'error': 'Apenas administradores podem ver cargos disponíveis'}, 
                status=status.HTTP_403_FORBIDDEN
            )
        
        roles = [{'code': code, 'name': name} for code, name in User.ROLE_CHOICES]
        return Response({'roles': roles})
    
    #------------------------------#
    # Seção de exclusão de usuários
    #------------------------------#
    def destroy(self, request, *args, **kwargs):
        user_to_delete = self.get_object()

        #Apenas superusuário ou administrador podem excluir contas.
        if not (request.user.is_superuser or request.user.role == 'administrator'):
            return Response(
                {'error': 'Você não tem permissão para excluir contas de usuário.'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        #Um usuário não pode excluir a própria conta.
        if request.user.id == user_to_delete.id:
            return Response(
                {'error': 'Você não pode excluir sua própria conta.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        if user_to_delete.is_superuser:
            return Response(
                {'error': 'Contas de superusuário não podem ser excluídas.'},
                status=status.HTTP_403_FORBIDDEN
            )

        if not request.user.is_superuser and \
           not user_to_delete.is_superuser and \
           request.user.role == 'administrator' and \
           user_to_delete.role == 'administrator':
            return Response(
                {'error': 'Administradores não podem excluir outras contas de administrador.'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        self.perform_destroy(user_to_delete)
        return Response(status=status.HTTP_204_NO_CONTENT)

class ProfileView(generics.RetrieveUpdateAPIView):
    queryset = User.objects.all()
    serializer_class = UserProfileUpdateSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user

    def get(self, request, *args, **kwargs):
        serializer = UserRoleSerializer(self.get_object())
        return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def my_permissions(request):
    user = request.user
    return Response({
        'user': {
            'id': user.id,
            'name': user.name,
            'email': user.email,
            'role': user.role,
            'role_display': user.get_role_display()
        },
        'permissions': user.get_permissions(),
        'can_manage_users': user.can_manage_users(),
        'can_change_roles': user.can_change_user_role(),
        'can_export_reports': user.can_export_reports()
    })

class PasswordChangeAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        serializer = PasswordChangeSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = request.user
        old_password = serializer.validated_data["old_password"]
        new_password = serializer.validated_data["new_password"]

        if not user.check_password(old_password):
            return Response(
                {"old_password": ["Senha antiga incorreta."]},
                status=status.HTTP_400_BAD_REQUEST
            )

        user.set_password(new_password)
        user.save()

        return Response({"success": "Senha alterada com sucesso."},
                        status=status.HTTP_200_OK)
    
