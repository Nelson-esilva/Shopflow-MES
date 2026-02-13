from rest_framework.routers import DefaultRouter
from .views import ProductionPlanViewSet


router = DefaultRouter()
router.register(r'plans', ProductionPlanViewSet, basename='production-plan')
urlpatterns = router.urls
