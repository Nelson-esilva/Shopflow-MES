from clickhouse_driver import Client
from collections import Counter
import json
from datetime import datetime

# Configurações
HOST = "localhost"
PORT = 9000
USERNAME = "clickhouse_collector_user"
PASSWORD = "collector_password"
DATABASE = "production_data"
TABLE = "daily_line_dashboard_absolutes"

# Parâmetros de entrada
line_name = "Linha 1"
product_name = "Produto X"
data_referencia = "2025-06-30"  # formato YYYY-MM-DD

# Conectar
client = Client(
    host=HOST,
    port=PORT,
    user=USERNAME,
    password=PASSWORD,
    database=DATABASE
)

# Consulta bruta
query = f"""
SELECT 
    station_name,
    total_quantity_completed,
    total_quantity_planned,
    quantity_meta,
    top_defects,
    last_production_time
FROM {TABLE}
WHERE line_name = %(line)s 
  AND product_name = %(product)s 
  AND toDate(registered_at) = toDate(%(data)s)
"""

params = {"line": line_name, "product": product_name, "data": data_referencia}
rows = client.execute(query, params)

# Variáveis de consolidação
total_completed = 0
total_planned = 0
total_meta = 0
total_production_time = 0
all_defects = Counter()
stations = []

# Processamento linha a linha
for row in rows:
    station, completed, planned, meta, defects_json, last_time = row

    total_completed += completed
    total_planned += planned
    total_meta += meta
    total_production_time += last_time

    stations.append(station)

    # Parse dos defeitos e soma
    if defects_json:
        defects_dict = json.loads(defects_json)
        all_defects.update(defects_dict)

# Cálculo da eficiência final
efficiency = round((total_completed / total_planned) * 100, 2) if total_planned else 0

# Consolidação final
out = {
    "line_name": line_name,
    "product_name": product_name,
    "date": data_referencia,
    "stations": sorted(set(stations)),
    "total_quantity_completed": total_completed,
    "total_quantity_planned": total_planned,
    "quantity_meta": total_meta,
    "total_production_time": total_production_time,
    "efficiency_percent": efficiency,
    "top_defects": dict(all_defects)
}

# Exibição JSON final
print(json.dumps(out, indent=2, ensure_ascii=False))
