print(">>> INICIANDO IMPORTS DAS VIEWS <<<")

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .clickhouse_service import fetch_daily_line_relativo_consolidado, fetch_daily_line_absoluto_consolidado
from .clickhouse_dashboard_service import get_daily_line_dashboard_data
import logging


logger = logging.getLogger(__name__)

class DailyLineRelativoConsolidadoView(APIView):
    def get(self, request, format=None):
        try:
            data = fetch_daily_line_relativo_consolidado()
            return Response(data, status=status.HTTP_200_OK)
        except Exception as e:
            logger.error(f"Erro na view DailyLineRelativoConsolidadoView: {e}")
            return Response({"error": "Não foi possível recuperar os dados."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class DailyLineAbsolutoConsolidadoView(APIView):
    def get(self, request, format=None):
        try:
            data = fetch_daily_line_absoluto_consolidado()
            return Response(data, status=status.HTTP_200_OK)
        except Exception as e:
            logger.error(f"Erro na view DailyLineAbsolutoConsolidadoView: {e}")
            return Response({"error": "Não foi possível recuperar os dados."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class DailyLineDashboardView(APIView):
    def get(self, request, format=None):
        line_name = request.query_params.get('line_name')
        product_name = request.query_params.get('product_name')
        date_str = request.query_params.get('date') # Espera YYYY-MM-DD

        if not all([line_name, product_name, date_str]):
            return Response(
                {"error": "Parâmetros 'line_name', 'product_name' e 'date' são obrigatórios."},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            data = get_daily_line_dashboard_data(line_name, product_name, date_str)
            if data:
                return Response(data, status=status.HTTP_200_OK)
            else:
                return Response(
                    {"error": "Não foi possível obter os dados do dashboard. Verifique os parâmetros ou a conexão com o ClickHouse."},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )
        except Exception as e:
            logger.error(f"Erro na view DailyLineDashboardView: {e}")
            return Response(
                {"error": "Ocorreu um erro interno ao processar sua requisição."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )