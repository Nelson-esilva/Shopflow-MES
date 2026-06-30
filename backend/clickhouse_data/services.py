import json
import logging
from collections import Counter
from datetime import datetime

from .client import get_clickhouse_client

logger = logging.getLogger(__name__)

STR_INIT_HOUR = " 00:00:00"
STR_FINAL_HOUR = " 23:59:59"


def _row_to_dict(columns, rows):
    result = []
    for row in rows:
        row_dict = {}
        for i, col_name in enumerate(columns):
            value = row[i]
            if isinstance(value, datetime):
                row_dict[col_name] = value.isoformat()
            elif col_name == "top_defects" and isinstance(value, str):
                try:
                    row_dict[col_name] = json.loads(value)
                except json.JSONDecodeError:
                    row_dict[col_name] = value
            else:
                row_dict[col_name] = value
        result.append(row_dict)
    return result


def _execute_query(query, params=None):
    client = get_clickhouse_client()
    try:
        data = client.execute(query, params or {}, columnar=False, with_column_types=True)
        columns = [col[0] for col in data[1]]
        return _row_to_dict(columns, data[0])
    finally:
        client.disconnect()


def fetch_daily_line_relativo_consolidado():
    return _execute_query(
        "SELECT * FROM daily_line_relativo_consolidado ORDER BY registered_at DESC LIMIT 100"
    )


def fetch_daily_line_absoluto_consolidado():
    return _execute_query(
        "SELECT * FROM daily_line_absoluto_consolidado ORDER BY registered_at DESC LIMIT 100"
    )


def get_daily_line_dashboard_data(line_name, product_name, date_str):
    client = get_clickhouse_client()
    try:
        query = """
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
        rows = client.execute(
            query,
            {"line": line_name, "product": product_name, "data": date_str},
        )

        total_completed = 0
        total_planned = 0
        total_meta = 0
        max_last_production_time = 0
        all_defects = Counter()
        stations = []
        processed_records = []

        for row in rows:
            station, completed, planned, meta, defects_json, last_time, registered_at_dt = row
            total_completed += completed
            total_planned += planned
            total_meta += meta
            max_last_production_time = max(max_last_production_time, last_time)
            stations.append(station)

            if defects_json:
                try:
                    all_defects.update(json.loads(defects_json))
                except json.JSONDecodeError:
                    logger.warning("Defeitos JSON inválido: %s", defects_json)

            if isinstance(registered_at_dt, datetime):
                processed_records.append({
                    "station_name": station,
                    "total_quantity_completed": completed,
                    "total_quantity_planned": planned,
                    "quantity_meta": meta,
                    "top_defects": json.loads(defects_json) if defects_json else {},
                    "last_production_time": last_time,
                    "registered_date": registered_at_dt.strftime("%Y-%m-%d"),
                    "registered_time": registered_at_dt.strftime("%H:%M:%S"),
                })

        efficiency = round((total_completed / total_planned) * 100, 2) if total_planned else 0
        return {
            "line_name": line_name,
            "product_name": product_name,
            "query_date": date_str,
            "stations": sorted(set(stations)),
            "total_quantity_completed": total_completed,
            "total_quantity_planned": total_planned,
            "quantity_meta": total_meta,
            "max_last_production_time": max_last_production_time,
            "efficiency_percent": efficiency,
            "top_defects": dict(all_defects),
            "records_by_station_and_time": processed_records,
        }
    except Exception as e:
        logger.error("Erro ao obter dados do dashboard: %s", e)
        return None
    finally:
        client.disconnect()


def _build_workstation_query(filters, production_plan_id):
    conditions = []

    if filters.get("product_id"):
        conditions.append(f"product_id = {filters['product_id']}")
    if filters.get("production_line_id"):
        conditions.append(f"production_line_id = {filters['production_line_id']}")
    if filters.get("station_id"):
        conditions.append(f"station_id = {filters['station_id']}")
    if production_plan_id is not None:
        conditions.append(f"production_plan_id = {production_plan_id}")
    if filters.get("registered_at"):
        init_date = filters["registered_at"] + STR_INIT_HOUR
        final_date = filters["registered_at"] + STR_FINAL_HOUR
        conditions.append(f"registered_at BETWEEN '{init_date}' AND '{final_date}'")

    where_clause = " AND ".join(conditions) if conditions else "1=1"
    return f"""
        SELECT *
        FROM workstation_records
        WHERE {where_clause}
        ORDER BY registered_at DESC
    """


def fetch_workstation_records(filters, production_plan_id=None):
    client = get_clickhouse_client()
    try:
        return client.execute(_build_workstation_query(filters, production_plan_id))
    finally:
        client.disconnect()


def workstation_records_to_json(records, quantity_planned=0):
    line_name = "line "
    station_name = "station "
    product_name = "product "
    product_order_name = "product order "

    payload = []
    for data in records:
        payload.append({
            "record id": data[0],
            "line": line_name + str(data[2]),
            "station": station_name + str(data[3]),
            "product": product_name + str(data[1]),
            "product order": product_order_name + str(data[4]),
            "quantity produced": data[6],
            "quantity defective": data[6] * data[7],
            "registered at": data[8],
        })

    total_produced = sum(item["quantity produced"] for item in payload)
    total_defective = sum(item["quantity defective"] for item in payload)
    total_units = total_produced - total_defective
    fpy = round((total_units / total_produced) * 100, 2) if total_produced else 0
    efficiency = round((total_produced / quantity_planned) * 100, 2) if quantity_planned else 0

    payload.append({
        "total produced": total_produced,
        "total good units": total_units,
        "total defective units": total_defective,
        "quantity planned": quantity_planned,
        "FPY": fpy,
        "Efficiency_to_planned": efficiency,
    })
    return payload
