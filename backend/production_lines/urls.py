from rest_framework.routers import DefaultRouter
from .views import ProductionLineViewSet, ProductionLineCapacityViewSet
from django.urls import path, include

router = DefaultRouter()
router.register(r'lines', ProductionLineViewSet, basename='productionline')
router.register(r'capacities', ProductionLineCapacityViewSet, basename='production_line_capacity')

urlpatterns = [
    path('', include(router.urls)),
]