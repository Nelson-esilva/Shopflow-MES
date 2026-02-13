from rest_framework.routers import DefaultRouter
from .views import ProductionDefectViewSet

router = DefaultRouter()
router.register(r'defects', ProductionDefectViewSet)
urlpatterns = router.urls