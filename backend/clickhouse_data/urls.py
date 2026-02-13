# backend/clickhouse_data/urls.py

from django.urls import path
from .views import DailyLineRelativoConsolidadoView, DailyLineAbsolutoConsolidadoView, DailyLineDashboardView

urlpatterns = [
    path("daily-relativo/", DailyLineRelativoConsolidadoView.as_view(), name="daily_relativo_data"),
    path("daily-absoluto/", DailyLineAbsolutoConsolidadoView.as_view(), name="daily_absoluto_data"),
    path("dashboard/", DailyLineDashboardView.as_view(), name="daily_line_dashboard"),
]