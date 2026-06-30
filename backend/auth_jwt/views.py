from rest_framework import generics, status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from user.serializers import UserProfileUpdateSerializer, UserRegisterSerializer, UserRoleSerializer

from . import serializers


class UserRegisterationAPIView(generics.CreateAPIView):
    permission_classes = (AllowAny,)
    serializer_class = UserRegisterSerializer


class UserLoginAPIView(generics.GenericAPIView):
    permission_classes = (AllowAny,)
    serializer_class = serializers.AuthLoginSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data, context={"request": request})
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data
        refresh = RefreshToken.for_user(user)
        return Response({
            "email": user.email,
            "tokens": {
                "refresh": str(refresh),
                "access": str(refresh.access_token),
            },
        }, status=status.HTTP_200_OK)


class UserLogoutAPIView(generics.GenericAPIView):
    permission_classes = (IsAuthenticated,)

    def post(self, request):
        try:
            refresh_token = request.data.get("refresh")
            if refresh_token:
                token = RefreshToken(refresh_token)
                token.blacklist()
                return Response({"detail": "Logout realizado com sucesso."}, status=status.HTTP_205_RESET_CONTENT)
            return Response({"detail": "Nao foi fornecido o refresh."}, status=status.HTTP_406_NOT_ACCEPTABLE)
        except Exception:
            return Response({"detail": "Logout nao realizado."}, status=status.HTTP_400_BAD_REQUEST)


class UserProfileAPIView(generics.RetrieveUpdateAPIView):
    permission_classes = (IsAuthenticated,)

    def get_object(self):
        return self.request.user

    def get_serializer_class(self):
        if self.request.method in ("PUT", "PATCH"):
            return UserProfileUpdateSerializer
        return UserRoleSerializer


class UserCheckAPIView(generics.GenericAPIView):
    permission_classes = (AllowAny,)

    def get(self, request):
        return Response({
            "status": "ok",
            "message": "API respondendo com sucesso.",
            "version": "1.0.0",
        })
