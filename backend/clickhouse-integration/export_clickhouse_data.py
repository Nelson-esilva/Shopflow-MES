from clickhouse_driver import Client
import json
import csv

# Configurações de conexão com o ClickHouse no NUC
CLICKHOUSE_NUC_HOST = 'localhost'
CLICKHOUSE_NUC_PORT = 9001
CLICKHOUSE_NUC_USER = 'clickhouse_collector_user'
CLICKHOUSE_NUC_PASSWORD = 'collector_password'
CLICKHOUSE_NUC_DB = 'production_data'

def export_table_to_jsonl(table_name, output_file):
    client = Client(
        host=CLICKHOUSE_NUC_HOST,
        port=CLICKHOUSE_NUC_PORT,
        user=CLICKHOUSE_NUC_USER,
        password=CLICKHOUSE_NUC_PASSWORD,
        database=CLICKHOUSE_NUC_DB
    )
    
    try:
        query = f"SELECT * FROM {table_name}"
        result = client.execute(query, columnar=True)
        
        # Obter nomes das colunas
        columns = [desc[0] for desc in client.description]
        
        with open(output_file, 'w', encoding='utf-8') as f:
            for i in range(len(result[0])):
                row = {columns[j]: result[j][i] for j in range(len(columns))}
                f.write(json.dumps(row, default=str) + '\n')
        print(f"Dados da tabela '{table_name}' exportados para '{output_file}' com sucesso.")
        
    except Exception as e:
        print(f"Erro ao exportar dados da tabela '{table_name}': {e}")
    finally:
        client.disconnect()

def export_table_to_csv(table_name, output_file):
    client = Client(
        host=CLICKHOUSE_NUC_HOST,
        port=CLICKHOUSE_NUC_PORT,
        user=CLICKHOUSE_NUC_USER,
        password=CLICKHOUSE_NUC_PASSWORD,
        database=CLICKHOUSE_NUC_DB
    )
    
    try:
        query = f"SELECT * FROM {table_name}"
        result = client.execute(query)
        
        # Obter nomes das colunas
        columns = [desc[0] for desc in client.description]
        
        with open(output_file, 'w', newline='', encoding='utf-8') as f:
            writer = csv.writer(f)
            writer.writerow(columns) # Escreve o cabeçalho
            for row in result:
                writer.writerow(row)
        print(f"Dados da tabela '{table_name}' exportados para '{output_file}' com sucesso.")
        
    except Exception as e:
        print(f"Erro ao exportar dados da tabela '{table_name}': {e}")
    finally:
        client.disconnect()

if __name__ == '__main__':
    # Exemplo de uso:
    export_table_to_jsonl('daily_line_relativo_consolidado', 'daily_line_relativo_consolidado.jsonl')
    export_table_to_jsonl('daily_line_absoluto_consolidado', 'daily_line_absoluto_consolidado.jsonl')
    
    # Ou para CSV:
    # export_table_to_csv('daily_line_relativo_consolidado', 'daily_line_relativo_consolidado.csv')
    # export_table_to_csv('daily_line_absoluto_consolidado', 'daily_line_absoluto_consolidado.csv')