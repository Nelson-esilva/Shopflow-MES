import uuid
import random
from datetime import datetime
import pytz
from clickhouse_connect import get_client

# Configuração
HOST = "localhost"
PORT = 8123
USERNAME = "clickhouse_collector_user"
PASSWORD = "collector_password"
DATABASE = "production_data"

# Conectar ao ClickHouse
client = get_client(
    host=HOST,
    port=PORT,
    username=USERNAME,
    password=PASSWORD,
    database=DATABASE,
    secure=False
)

# Gerar dados aleatórios no formato de lista de tuplas
records = [
    (
        uuid.uuid4(),                             # record_id (UUID)
        random.randint(1, 3),                   # product_id
        random.randint(1, 3),                    # production_line_id
        random.randint(1, 9),                    # station_id
        random.randint(1, 3),                    # production_plan_id
        random.choice([None, random.randint(1, 5)]),  # defect_id
        random.randint(1, 10),                    # produced_quantity
        random.randint(0, 1),                     # has_defect
        datetime.now(pytz.timezone("America/Manaus")),  # registered_at
        False                                     # data_sended
    )
    for _ in range(5)
]

# Inserir os dados na tabela
client.insert(
    table='workstation_records',
    data=records,
    column_names=[
        'record_id',
        'product_id',
        'production_line_id',
        'station_id',
        'production_plan_id',
        'defect_id',
        'produced_quantity',
        'has_defect',
        'registered_at',
        'data_sended'
    ]
)

print("✅ Dados inseridos com sucesso.")
