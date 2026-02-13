from clickhouse_driver import Client
from datetime import datetime, timedelta
import random
import json

CLICKHOUSE_HOST = 'clickhouse'
CLICKHOUSE_PORT = 9000
CLICKHOUSE_USER = 'clickhouse_server_user'
CLICKHOUSE_PASSWORD = 'shopflow_password'
CLICKHOUSE_DB = 'production_data'

def populate_clickhouse_tables(num_entries=10):
    client = Client(host=CLICKHOUSE_HOST, port=CLICKHOUSE_PORT, user=CLICKHOUSE_USER, password=CLICKHOUSE_PASSWORD, database=CLICKHOUSE_DB)

    lines = ["Linha A", "Linha B", "Linha C"]
    products = ["Produto X", "Produto Y", "Produto Z"]
    stations = ["Estacao 1", "Estacao 2", "Estacao 3"]
    production_orders = ["PO-001", "PO-002", "PO-003"]

    # Popular daily_line_relativo_consolidado
    relativo_data = []
    for i in range(num_entries):
        line_name = random.choice(lines)
        product_name = random.choice(products)
        production_order_name = random.choice(production_orders)
        quantity_completed = random.randint(50, 200)
        quantity_planned = random.randint(100, 250)
        quantity_meta = random.randint(10, 50)
        operational_time_minutes = random.randint(300, 480)
        downtime_minutes = random.randint(10, 60)
        fpy = round(random.uniform(0.85, 0.99), 2)
        efficiency = round(random.uniform(0.70, 0.95), 2)
        registered_at = datetime.now() - timedelta(days=random.randint(0, 30))

        relativo_data.append((
            i + 1,
            line_name,
            product_name,
            production_order_name,
            quantity_completed,
            quantity_planned,
            quantity_meta,
            operational_time_minutes,
            downtime_minutes,
            fpy,
            efficiency,
            registered_at
        ))
    client.execute(
        "INSERT INTO daily_line_relativo_consolidado VALUES",
        relativo_data
    )
    print(f"Inseridos {num_entries} registros em 'daily_line_relativo_consolidado'.")

    # Popular daily_line_absoluto_consolidado
    absoluto_data = []
    for i in range(num_entries):
        line_name = random.choice(lines)
        station_name = random.choice(stations)
        product_name = random.choice(products)
        production_order_name = random.choice(production_orders)
        total_quantity_completed = random.randint(500, 1500)
        total_quantity_planned = random.randint(1000, 2000)
        quantity_meta = random.randint(100, 300)
        top_defects = json.dumps({"defect_A": random.randint(1, 10), "defect_B": random.randint(1, 5)}) # Exemplo de JSON
        efficiency = round(random.uniform(0.75, 0.98), 2)
        last_production_time = int(datetime.now().timestamp()) - random.randint(0, 3600)
        registered_at = datetime.now() - timedelta(days=random.randint(0, 30))

        absoluto_data.append((
            i + 1,
            line_name,
            station_name,
            product_name,
            production_order_name,
            total_quantity_completed,
            total_quantity_planned,
            quantity_meta,
            top_defects,
            efficiency,
            last_production_time,
            registered_at
        ))
    client.execute(
        "INSERT INTO daily_line_absoluto_consolidado VALUES",
        absoluto_data
    )
    print(f"Inseridos {num_entries} registros em 'daily_line_absoluto_consolidado'.")

    client.disconnect()

if __name__ == '__main__':
    populate_clickhouse_tables(num_entries=20)