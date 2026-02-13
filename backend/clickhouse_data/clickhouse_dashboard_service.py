# backend/clickhouse_data/clickhouse_dashboard_service.py

from clickhouse_driver import Client
from collections import Counter
import json
from datetime import datetime, date
import logging

logger = logging.getLogger(__name__)

# Configurações de conexão com o ClickHouse no NUC
# ATENÇÃO: Substitua pelo IP real do seu NUC e credenciais
CLICKHOUSE_CLOUD_HOST = 'clickhouse'
CLICKHOUSE_CLOUD_PORT = 9000
CLICKHOUSE_CLOUD_USER = 'clickhouse_server_user'
CLICKHOUSE_CLOUD_PASSWORD = 'shopflow_password'
CLICKHOUSE_CLOUD_DB = 'production_data'

def get_clickhouse_nuc_client():
    try:
        client = Client(
            host=CLICKHOUSE_CLOUD_HOST,
            port=CLICKHOUSE_CLOUD_PORT,
            user=CLICKHOUSE_CLOUD_USER,
            password=CLICKHOUSE_CLOUD_PASSWORD,
            database=CLICKHOUSE_CLOUD_DB
        )
        return client
    except Exception as e:
        logger.error(f"Erro ao conectar ao ClickHouse no NUC: {e}")
        return None

def get_daily_line_dashboard_data(
    line_name: str,
    product_name: str,
    date_str: str # Formato YYYY-MM-DD
):
    client = None
    try:
        client = get_clickhouse_nuc_client()
        if not client:
            return None
        
        query = f"""
        SELECT 
            station_name,
            total_quantity_completed,
            total_quantity_planned,
            quantity_meta,
            top_defects,
            last_production_time,
            registered_at
        FROM daily_line_absoluto_consolidado
        WHERE line_name = %(line)s 
          AND product_name = %(product)s 
          AND toDate(registered_at) = toDate(%(data)s)
        """

        params = {"line": line_name, "product": product_name, "data": date_str}
        rows = client.execute(query, params)

        # Variáveis de consolidação
        total_completed = 0
        total_planned = 0
        total_meta = 0
        max_last_production_time = 0
        all_defects = Counter()
        stations = []
        
        # Para separar data e hora do registered_at
        processed_records = []

        for row in rows:
            station, completed, planned, meta, defects_json, last_time, registered_at_dt = row

            total_completed += completed
            total_planned += planned
            total_meta += meta
            
            if last_time > max_last_production_time:
                max_last_production_time = last_time

            stations.append(station)

            # Parse dos defeitos e soma
            if defects_json:
                try:
                    defects_dict = json.loads(defects_json)
                    all_defects.update(defects_dict)
                except json.JSONDecodeError:
                    logger.warning(f"Defeitos JSON inválido: {defects_json}")

            # Separar data e hora do registered_at
            if isinstance(registered_at_dt, datetime):
                processed_records.append({
                    "station_name": station,
                    "total_quantity_completed": completed,
                    "total_quantity_planned": planned,
                    "quantity_meta": meta,
                    "top_defects": json.loads(defects_json) if defects_json else {},
                    "last_production_time": last_time,
                    "registered_date": registered_at_dt.strftime("%Y-%m-%d"),
                    "registered_time": registered_at_dt.strftime("%H:%M:%S")
                })

        # Cálculo da eficiência final
        efficiency = round((total_completed / total_planned) * 100, 2) if total_planned else 0

        # Consolidação final
        out = {
            "line_name": line_name,
            "product_name": product_name,
            "query_date": date_str,
            "stations": sorted(list(set(stations))), # Garantir lista única e ordenada
            "total_quantity_completed": total_completed,
            "total_quantity_planned": total_planned,
            "quantity_meta": total_meta,
            "max_last_production_time": max_last_production_time, # Usando o máximo
            "efficiency_percent": efficiency,
            "top_defects": dict(all_defects),
            "records_by_station_and_time": processed_records # Dados detalhados por estação e hora
        }
        return out

    except Exception as e:
        logger.error(f"Erro ao obter dados do dashboard: {e}")
        return None
    finally:
        if client:
            client.disconnect()

if __name__ == '__main__':
    test_line = "Linha A"
    test_product = "Produto Y"
    test_date = "2025-06-10"
    
    data = get_daily_line_dashboard_data(test_line, test_product, test_date)
    if data:
        print(json.dumps(data, indent=2, ensure_ascii=False))
    else:
        print("Não foi possível obter os dados do dashboard.")