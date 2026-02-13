from clickhouse_connect import get_client
from datetime import datetime, timedelta
import random
import json

# Configuração
HOST = "localhost"  # Altere se for outro servidor
PORT = 8123
USERNAME = "clickhouse_collector_user"
PASSWORD = "collector_password"
DATABASE = "production_data"

TABLE = "daily_line_dashboard_absolutes"

# Dados simulados
LINES = ["Linha 1", "Linha 2", "Linha 3"]
STATIONS = ["Estação A", "Estação B", "Estação C"]
PRODUCTS = ["Produto X", "Produto Y", "Produto Z"]
DEFECT_TYPES = ["Falha Elétrica", "Falha Mecânica", "Defeito Estético", "Erro de Montagem", "Outro"]

# Conectar
client = get_client(
    host=HOST,
    port=PORT,
    username=USERNAME,
    password=PASSWORD,
    database=DATABASE
)

# Criar tabela se não existir
create_sql = f"""
CREATE TABLE IF NOT EXISTS {TABLE} (
    id UInt64,
    line_name String,
    station_name String,
    product_name String,
    production_order_name String,
    total_quantity_completed UInt32,
    total_quantity_planned UInt32,
    quantity_meta UInt32,
    top_defects String,
    efficiency Decimal(5,2),
    last_production_time UInt32,
    registered_at DateTime
) ENGINE = MergeTree
PARTITION BY toYYYYMM(toDateTime(registered_at))
ORDER BY (station_id, toDateTime(registered_at))
TTL toDateTime(registered_at) + INTERVAL 12 MONTH DELETE
SETTINGS index_granularity = 8192;
"""

client.command(create_sql)
print(f"✅ Tabela '{TABLE}' verificada/criada.")

# Gerar dados simulados
dados = []
id_counter = 1
registered_at = datetime.now().replace(hour=0, minute=0, second=0, microsecond=0)

for line in LINES:
    production_order = f"OP-{line.split()[-1]}-001"
    for station in STATIONS:
        for product in PRODUCTS:
            total_planned = random.randint(80, 150)
            total_completed = random.randint(int(total_planned * 0.7), total_planned)
            quantity_meta = total_planned
            efficiency = round((total_completed / total_planned) * 100, 2)
            last_production_time = random.randint(10, 60)  # em minutos

            # Defeitos simulados
            defects = random.sample(DEFECT_TYPES, k=random.randint(1, 3))
            defect_counts = {d: random.randint(1, 10) for d in defects}
            top_defects_json = json.dumps(defect_counts)

            dados.append((
                id_counter,
                line,
                station,
                product,
                production_order,
                total_completed,
                total_planned,
                quantity_meta,
                top_defects_json,
                efficiency,
                last_production_time,
                registered_at
            ))
            id_counter += 1

# Inserir dados
insert_sql = f"""
INSERT INTO {TABLE} (
    id, line_name, station_name, product_name, production_order_name,
    total_quantity_completed, total_quantity_planned, quantity_meta,
    top_defects, efficiency, last_production_time, registered_at
) VALUES
"""

client.insert(TABLE, dados)
print(f"✅ {len(dados)} registros inseridos na tabela '{TABLE}'.")
