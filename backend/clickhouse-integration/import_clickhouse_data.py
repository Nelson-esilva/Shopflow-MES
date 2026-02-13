# import_clickhouse_data.py

from clickhouse_driver import Client
import json
import csv

# Configurações de conexão com o ClickHouse no Servidor em Nuvem
CLICKHOUSE_CLOUD_HOST = 'your_cloud_server_ip' # Substitua pelo IP do seu servidor em nuvem
CLICKHOUSE_CLOUD_PORT = 9000
CLICKHOUSE_CLOUD_USER = 'default'
CLICKHOUSE_CLOUD_PASSWORD = ''
CLICKHOUSE_CLOUD_DB = 'default'

def import_jsonl_to_table(table_name, input_file):
    client = Client(
        host=CLICKHOUSE_CLOUD_HOST,
        port=CLICKHOUSE_CLOUD_PORT,
        user=CLICKHOUSE_CLOUD_USER,
        password=CLICKHOUSE_CLOUD_PASSWORD,
        database=CLICKHOUSE_CLOUD_DB,
        # secure=True, # Descomente se estiver usando HTTPS/SSL
        # verify=False # Descomente se estiver usando SSL autoassinado (NÃO RECOMENDADO EM PRODUÇÃO)
    )
    
    try:
        data_to_insert = []
        with open(input_file, 'r', encoding='utf-8') as f:
            for line in f:
                row = json.loads(line.strip())
                # Esta parte precisa ser adaptada para cada tabela e seus campos
                if table_name == 'daily_line_relativo_consolidado':
                    data_to_insert.append((
                        row.get('id'), row.get('line_name'), row.get('product_name'),
                        row.get('production_order_name'), row.get('quantity_completed'),
                        row.get('quantity_planned'), row.get('quantity_meta'),
                        row.get('operational_time_minutes'), row.get('downtime_minutes'),
                        row.get('fpy'), row.get('efficiency'), row.get('registered_at')
                    ))
                elif table_name == 'daily_line_absoluto_consolidado':
                    data_to_insert.append((
                        row.get('id'), row.get('line_name'), row.get('station_name'),
                        row.get('product_name'), row.get('production_order_name'),
                        row.get('total_quantity_completed'), row.get('total_quantity_planned'),
                        row.get('quantity_meta'), json.dumps(row.get('top_defects')), # top_defects é JSON
                        row.get('efficiency'), row.get('last_production_time'), row.get('registered_at')
                    ))
                # Adicione mais 'elif' para outras tabelas, se necessário

        if data_to_insert:
            # A query INSERT INTO VALUES é mais flexível com a ordem das colunas
            # mas é crucial que a ordem dos valores em data_to_insert corresponda à ordem das colunas na query
            if table_name == 'daily_line_relativo_consolidado':
                query = "INSERT INTO daily_line_relativo_consolidado (id, line_name, product_name, production_order_name, quantity_completed, quantity_planned, quantity_meta, operational_time_minutes, downtime_minutes, fpy, efficiency, registered_at) VALUES"
            elif table_name == 'daily_line_absoluto_consolidado':
                query = "INSERT INTO daily_line_absoluto_consolidado (id, line_name, station_name, product_name, production_order_name, total_quantity_completed, total_quantity_planned, quantity_meta, top_defects, efficiency, last_production_time, registered_at) VALUES"
            
            client.execute(query, data_to_insert)
            print(f"Dados do arquivo \'{input_file}\' importados para a tabela \'{table_name}\' com sucesso.")
        else:
            print(f"Nenhum dado para importar do arquivo \'{input_file}\'.")
            
    except Exception as e:
        print(f"Erro ao importar dados para a tabela \'{table_name}\': {e}")
    finally:
        client.disconnect()

def import_csv_to_table(table_name, input_file):
    client = Client(
        host=CLICKHOUSE_CLOUD_HOST,
        port=CLICKHOUSE_CLOUD_PORT,
        user=CLICKHOUSE_CLOUD_USER,
        password=CLICKHOUSE_CLOUD_PASSWORD,
        database=CLICKHOUSE_CLOUD_DB,
        # secure=True,
        # verify=False
    )
    
    try:
        data_to_insert = []
        with open(input_file, 'r', newline='', encoding='utf-8') as f:
            reader = csv.reader(f)
            header = next(reader) # Pula o cabeçalho
            for row in reader:
                # Mapear os dados do CSV para a ordem das colunas da tabela ClickHouse
                # Esta parte precisa ser adaptada para cada tabela e seus campos
                # Exemplo para daily_line_relativo_consolidado (assumindo a ordem do CSV)
                if table_name == 'daily_line_relativo_consolidado':
                    data_to_insert.append((
                        int(row[0]), row[1], row[2], row[3], # id, line_name, product_name, production_order_name
                        int(row[4]), int(row[5]), int(row[6]), # quantity_completed, quantity_planned, quantity_meta
                        int(row[7]), int(row[8]), float(row[9]), # operational_time_minutes, downtime_minutes, fpy
                        float(row[10]), row[11] # efficiency, registered_at
                    ))
                # Adicione mais 'elif' para outras tabelas, se necessário

        if data_to_insert:
            # A query INSERT INTO VALUES é mais flexível com a ordem das colunas
            if table_name == 'daily_line_relativo_consolidado':
                query = "INSERT INTO daily_line_relativo_consolidado (id, line_name, product_name, production_order_name, quantity_completed, quantity_planned, quantity_meta, operational_time_minutes, downtime_minutes, fpy, efficiency, registered_at) VALUES"
            
            client.execute(query, data_to_insert)
            print(f"Dados do arquivo \'{input_file}\' importados para a tabela \'{table_name}\' com sucesso.")
        else:
            print(f"Nenhum dado para importar do arquivo \'{input_file}\'.")
            
    except Exception as e:
        print(f"Erro ao importar dados para a tabela \'{table_name}\': {e}")
    finally:
        client.disconnect()

if __name__ == '__main__':
    # Exemplo de uso:
    # Certifique-se de que os arquivos .jsonl ou .csv foram transferidos para o servidor
    import_jsonl_to_table('daily_line_relativo_consolidado', 'daily_line_relativo_consolidado.jsonl')
    import_jsonl_to_table('daily_line_absoluto_consolidado', 'daily_line_absoluto_consolidado.jsonl')
    
    # Ou para CSV:
    # import_csv_to_table('daily_line_relativo_consolidado', 'daily_line_relativo_consolidado.csv')