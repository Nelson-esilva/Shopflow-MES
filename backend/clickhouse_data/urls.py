from django.urls import path
from rest_framework.routers import DefaultRouter

from .views import (
    DailyLineAbsolutoConsolidadoView,
    DailyLineDashboardView,
    DailyLineRelativoConsolidadoView,
    WorkstationRelativoView,
)

router = DefaultRouter()
router.register(
    r"daily_workstation_relativo",
    WorkstationRelativoView,
    basename="daily_workstation_relativo",
)

urlpatterns = [
    path("daily-relativo/", DailyLineRelativoConsolidadoView.as_view(), name="daily_relativo_data"),
    path("daily-absoluto/", DailyLineAbsolutoConsolidadoView.as_view(), name="daily_absoluto_data"),
    path("dashboard/", DailyLineDashboardView.as_view(), name="daily_line_dashboard"),
    *router.urls,
]
