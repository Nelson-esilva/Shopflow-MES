# backend/clickhouse_data/clickhouse_service.py

from clickhouse_driver import Client
import logging

logger = logging.getLogger(__name__)

# Configurações de conexão com o ClickHouse
CLICKHOUSE_CLOUD_HOST = 'clickhouse'
CLICKHOUSE_CLOUD_PORT = 9000
CLICKHOUSE_CLOUD_USER = 'clickhouse_server_user'
CLICKHOUSE_CLOUD_PASSWORD = 'shopflow_password'
CLICKHOUSE_CLOUD_DB = 'production_data'


def get_clickhouse_client():
    try:
        client = Client(
            host=CLICKHOUSE_CLOUD_HOST,
            port=CLICKHOUSE_CLOUD_PORT,
            user=CLICKHOUSE_CLOUD_USER,
            password=CLICKHOUSE_CLOUD_PASSWORD,
            database=CLICKHOUSE_CLOUD_DB,
            # secure=True, # Se estiver usando HTTPS/SSL
            # verify=False # Se estiver usando SSL autoassinadO
        )
        return client
    except Exception as e:
        logger.error(f"Erro ao conectar ao ClickHouse em nuvem: {e}")
        return None

def fetch_daily_line_relativo_consolidado():
    client = None
    try:
        client = get_clickhouse_client()
        if client:
            query = "SELECT * FROM daily_line_relativo_consolidado ORDER BY registered_at DESC LIMIT 100"
            # Retorna os dados como uma lista de dicionários para facilitar a serialização JSON
            data = client.execute(query, columnar=False, with_column_types=True)
            
            # Formatar o resultado para uma lista de dicionários
            columns = [col[0] for col in data[1]] # Nomes das colunas
            rows = data[0] # Dados das linhas
            
            result_list = []
            for row in rows:
                row_dict = {}
                for i, col_name in enumerate(columns):
                    value = row[i]
                    # Converter objetos datetime para string ISO format
                    if isinstance(value, datetime):
                        row_dict[col_name] = value.isoformat()
                    else:
                        row_dict[col_name] = value
                result_list.append(row_dict)
            return result_list
        return []
    except Exception as e:
        logger.error(f"Erro ao buscar dados de daily_line_relativo_consolidado: {e}")
        return []
    finally:
        if client:
            client.disconnect()

def fetch_daily_line_absoluto_consolidado():
    client = None
    try:
        client = get_clickhouse_client()
        if client:
            query = "SELECT * FROM daily_line_absoluto_consolidado ORDER BY registered_at DESC LIMIT 100"
            data = client.execute(query, columnar=False, with_column_types=True)
            
            columns = [col[0] for col in data[1]]
            rows = data[0]
            
            result_list = []
            for row in rows:
                row_dict = {}
                for i, col_name in enumerate(columns):
                    value = row[i]
                    if isinstance(value, datetime):
                        row_dict[col_name] = value.isoformat()
                    elif col_name == 'top_defects' and isinstance(value, str):
                        try:
                            row_dict[col_name] = json.loads(value)
                        except json.JSONDecodeError:
                            row_dict[col_name] = value
                    else:
                        row_dict[col_name] = value
                result_list.append(row_dict)
            return result_list
        return []
    except Exception as e:
        logger.error(f"Erro ao buscar dados de daily_line_absoluto_consolidado: {e}")
        return []
    finally:
        if client:
            client.disconnect()

# Você pode adicionar mais funções para outras consultas ao ClickHouse aqui