from django.urls import path
from auth_jwt import views
from rest_framework_simplejwt.views import TokenRefreshView
from user.views import PasswordChangeAPIView

urlpatterns = [
    path("register/", views.UserRegisterationAPIView.as_view(), name="create-user"),
    path("login/", views.UserLoginAPIView.as_view(), name="login-user"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token-refresh"),
    path("logout/", views.UserLogoutAPIView.as_view(), name="logout-user"),
    path("profile/", views.UserProfileAPIView.as_view(), name="user-profile"),
    path("change-password/", PasswordChangeAPIView.as_view(), name="change-password"),
    path("check/", views.UserCheckAPIView.as_view(), name="check"),
]





