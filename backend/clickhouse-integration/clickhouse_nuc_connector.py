
from clickhouse_driver import Client

# Configurações de conexão com o ClickHouse no NUC
# ATENÇÃO: Substitua 'YOUR_NUC_IP' pelo IP real do seu NUC
# Se o script for executado DIRETAMENTE no NUC, você pode usar 'localhost'
HOST = "localhost"
PORT = 9000
USERNAME = "clickhouse_collector_user"
PASSWORD = "collector_password"
DATABASE = "production_data"
TABLE = "daily_line_dashboard_absolutes"

def connect_to_clickhouse_nuc():
    try:
        client = Client(
            host=HOST,
            port=PORT,
            user=USERNAME,
            password=PASSWORD,
            database=DATABASE
        )
        print(f"Conexão bem-sucedida ao ClickHouse no NUC em {HOST}:{PORT}")
        return client
    except Exception as e:
        print(f"Erro ao conectar ao ClickHouse no NUC: {e}")
        return None

def fetch_sample_data(client, table_name, limit=5):
    if not client:
        print("Cliente ClickHouse não está conectado.")
        return []
    try:
        query = f"SELECT * FROM {table_name} LIMIT {limit}"
        result = client.execute(query)
        print(f"Dados de amostra da tabela \'{table_name}\' (primeiros {limit} registros):")
        for row in result:
            print(row)
        return result
    except Exception as e:
        print(f"Erro ao buscar dados da tabela \'{table_name}\': {e}")
        return []

def execute_query(client, query, params=None):
    """Executa qualquer query SQL e retorna os resultados"""
    if not client:
        print("Cliente não conectado")
        return None
    
    try:
        result = client.execute(query, params)
        return result
    except Exception as e:
        print(f"Erro na query: {e}\nQuery: {query}")
        return None

def show_tables(client):
    """Lista todas as tabelas no banco de dados"""
    return execute_query(client, "SHOW TABLES")

def describe_table(client, table_name):
    """Mostra a estrutura de uma tabela"""
    return execute_query(client, f"DESCRIBE TABLE {table_name}")

def insert_data(client, table_name, data):
    """Insere dados em uma tabela"""
    if not data:
        print("Nenhum dado fornecido para inserção")
        return False
    
    columns = ", ".join(data[0].keys())
    placeholders = ", ".join(["%s"] * len(data[0]))
    query = f"INSERT INTO {table_name} ({columns}) VALUES ({placeholders})"
    
    try:
        client.execute(query, [tuple(d.values()) for d in data])
        print(f"Inseridos {len(data)} registros em {table_name}")
        return True
    except Exception as e:
        print(f"Erro na inserção: {e}")
        return False

if __name__ == '__main__':
    nuc_client = connect_to_clickhouse_nuc()
    tables = show_tables(nuc_client)

