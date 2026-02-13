from rest_framework.routers import DefaultRouter
from .views import ProductionOrderViewSet


router = DefaultRouter()
router.register(r'orders', ProductionOrderViewSet, basename='production-order')
urlpatterns = router.urls
