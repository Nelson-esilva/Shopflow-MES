from django.contrib.auth import get_user_model
from user.models import User
from user.serializers import UserRegisterSerializer
from rest_framework import status
from rest_framework import generics
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from . import serializers

userModel = get_user_model()

class UserRegisterationAPIView(generics.CreateAPIView):

    permission_classes = (AllowAny,)
    serializer_class = UserRegisterSerializer

class UserLoginAPIView(generics.GenericAPIView):

    permission_classes = (AllowAny,)
    serializer_class = serializers.AuthLoginSerializer

    def post(self, request, *args, **kwargs):            
        serializer = self.serializer_class(data = request.data, context={'request':request})   
        serializer.is_valid(raise_exception=True)        
        user = serializer.validated_data   
        
        refresh = RefreshToken.for_user(user)        
    
        response_data = {
            'email': user.email,
            'tokens': {
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }
        }
        
        return Response(response_data, status=status.HTTP_200_OK)
            
class UserLogoutAPIView(generics.GenericAPIView):
    
    permission_classes = (IsAuthenticated,)

    def post(self, request):
        try:
            refresh_token = request.data.get("refresh")
            if refresh_token:
                token = RefreshToken(refresh_token)
                token.blacklist()
                return Response({'detail': 'Logout realizado com sucesso.'},status=status.HTTP_205_RESET_CONTENT)
            else:
                return Response({'detail': 'Não foi fornecido o refresh.'},status=status.HTTP_406_NOT_ACCEPTABLE)
        except Exception as e:
            return Response({'detail': 'Logout não realizado.'},status=status.HTTP_400_BAD_REQUEST)
        
class UserProfileAPIView(generics.RetrieveUpdateAPIView):

    queryset = User.objects.all()
    serializer_class = serializers.ProfileSerializer    
    permission_classes = (IsAuthenticated,)

    def get_object(self):
        return self.request.user
    
class UserCheckAPIView(generics.GenericAPIView):

    permission_classes = (AllowAny,)

    def get(self, request):
        return Response({
        "status": "ok",
        "message": "API respondendo com sucesso.",
        "version": "1.0.0"
    })