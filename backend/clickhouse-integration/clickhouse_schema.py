from clickhouse_driver import Client

CLICKHOUSE_HOST = 'clickhouse'
CLICKHOUSE_PORT = 9000
CLICKHOUSE_USER = 'clickhouse_server_user'
CLICKHOUSE_PASSWORD = 'shopflow_password'
CLICKHOUSE_DB = 'production_data'

def create_clickhouse_tables():
    client = Client(host=CLICKHOUSE_HOST, port=CLICKHOUSE_PORT, user=CLICKHOUSE_USER, password=CLICKHOUSE_PASSWORD, database=CLICKHOUSE_DB)

    # Cria a tabela daily_line_relativo_consolidado
    create_relativo_table_sql = '''
    CREATE TABLE IF NOT EXISTS daily_line_relativo_consolidado (
        id Int32,
        line_name String,
        product_name String,
        production_order_name String,
        quantity_completed Int32,
        quantity_planned Int32,
        quantity_meta Int32,
        operational_time_minutes Int32,
        downtime_minutes Int32,
        fpy Float32,
        efficiency Decimal(5, 2),
        registered_at DateTime
    ) ENGINE = MergeTree()
    ORDER BY (id, registered_at)
    '''
    client.execute(create_relativo_table_sql)
    print("Tabela 'daily_line_relativo_consolidado' criada ou já existe.")

    # Criar a tabela daily_line_absoluto_consolidado
    create_absoluto_table_sql = '''
    CREATE TABLE IF NOT EXISTS daily_line_absoluto_consolidado (
        id Int32,
        line_name String,
        station_name String,
        product_name String,
        production_order_name String,
        total_quantity_completed Int32,
        total_quantity_planned Int32,
        quantity_meta Int32,
        top_defects String, -- ClickHouse não tem tipo JSON nativo para colunas, usar String ou Map(String, String)
        efficiency Decimal(5, 2),
        last_production_time Int32,
        registered_at DateTime
    ) ENGINE = MergeTree()
    ORDER BY (id, registered_at)
    '''
    client.execute(create_absoluto_table_sql)
    print("Tabela 'daily_line_absoluto_consolidado' criada ou já existe.")

    client.disconnect()

if __name__ == '__main__':
    create_clickhouse_tables()