from rest_framework.routers import DefaultRouter
from . import views
from django.urls import path, include
from .views import PasswordChangeAPIView

router = DefaultRouter()
router.register(r'users', views.UserManagementViewSet, basename='user-management')

urlpatterns = [
    path('', include(router.urls)),
    path('my-permissions/', views.my_permissions, name='my-permissions'),
    path('me/', views.ProfileView.as_view(), name='my-profile'),
    path('me/change-password/', PasswordChangeAPIView.as_view(), name='change-password'),
]