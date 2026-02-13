from rest_framework.routers import DefaultRouter
from .views import WorkstationRelativoView


router = DefaultRouter()
router.register(r'daily_workstation_relativo', WorkstationRelativoView, basename='daily_workstation_relativo-order')
urlpatterns = router.urls
