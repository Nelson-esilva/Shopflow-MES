import logging

from django.shortcuts import get_object_or_404
from production_order.models import ProductionOrder
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.viewsets import ViewSet

from .services import (
    fetch_daily_line_absoluto_consolidado,
    fetch_daily_line_relativo_consolidado,
    fetch_workstation_records,
    get_daily_line_dashboard_data,
    workstation_records_to_json,
)

logger = logging.getLogger(__name__)

FILTER_KEYS = ("product_id", "production_line_id", "station_id", "registered_at")


def _get_filters(request):
    return {
        key: request.query_params[key]
        for key in FILTER_KEYS
        if request.query_params.get(key) not in (None, "")
    }


class DailyLineRelativoConsolidadoView(APIView):
    def get(self, request):
        try:
            return Response(fetch_daily_line_relativo_consolidado(), status=status.HTTP_200_OK)
        except Exception as e:
            logger.error("Erro em DailyLineRelativoConsolidadoView: %s", e)
            return Response(
                {"error": "Não foi possível recuperar os dados."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


class DailyLineAbsolutoConsolidadoView(APIView):
    def get(self, request):
        try:
            return Response(fetch_daily_line_absoluto_consolidado(), status=status.HTTP_200_OK)
        except Exception as e:
            logger.error("Erro em DailyLineAbsolutoConsolidadoView: %s", e)
            return Response(
                {"error": "Não foi possível recuperar os dados."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


class DailyLineDashboardView(APIView):
    def get(self, request):
        line_name = request.query_params.get("line_name")
        product_name = request.query_params.get("product_name")
        date_str = request.query_params.get("date")

        if not all([line_name, product_name, date_str]):
            return Response(
                {"error": "Parâmetros 'line_name', 'product_name' e 'date' são obrigatórios."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            data = get_daily_line_dashboard_data(line_name, product_name, date_str)
            if data:
                return Response(data, status=status.HTTP_200_OK)
            return Response(
                {"error": "Não foi possível obter os dados do dashboard."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
        except Exception as e:
            logger.error("Erro em DailyLineDashboardView: %s", e)
            return Response(
                {"error": "Ocorreu um erro interno ao processar sua requisição."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


class WorkstationRelativoView(ViewSet):
    permission_classes = (IsAuthenticated,)

    def list(self, request):
        records = fetch_workstation_records(_get_filters(request))
        return Response(workstation_records_to_json(records), status=status.HTTP_200_OK)

    def retrieve(self, request, pk=None):
        order = get_object_or_404(ProductionOrder, id=pk)
        records = fetch_workstation_records(_get_filters(request), production_plan_id=pk)
        return Response(
            workstation_records_to_json(records, order.quantity_planned),
            status=status.HTTP_200_OK,
        )
