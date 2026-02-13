from django.urls import path
from .views import GoogleLogin, GoogleLogoutView

urlpatterns = [
    #path('accounts/google/login/callback/', GoogleCallbackView.as_view(), name='google_callback'),
    path("api/auth/google/", GoogleLogin.as_view(), name='google_login'),
    path("api/auth/google/logout/", GoogleLogoutView.as_view(), name='google_logout'),
]
