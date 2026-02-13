from rest_framework.routers import DefaultRouter
from .views import LineStationViewSet
from django.urls import path, include

router = DefaultRouter()
router.register(r'stations', LineStationViewSet)

urlpatterns = [
    path('', include(router.urls)),
]