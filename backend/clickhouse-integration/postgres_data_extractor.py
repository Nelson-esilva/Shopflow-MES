import psycopg2

# Configurações de conexão com o PostgreSQL
PG_HOST = 'postgres'
PG_DB = 'postgres'
PG_USER = 'postgres'
PG_PASSWORD = 'postgres'
PG_PORT = 5432

def get_postgres_connection():
    conn = psycopg2.connect(
        host=PG_HOST,
        database=PG_DB,
        user=PG_USER,
        password=PG_PASSWORD,
        port=PG_PORT
    )
    return conn

def get_line_info(line_id):
    conn = None
    try:
        conn = get_postgres_connection()
        cur = conn.cursor()
        cur.execute("SELECT name FROM production_lines_productionline WHERE id = %s", (line_id,))
        result = cur.fetchone()
        return result[0] if result else None
    except Exception as e:
        print(f"Erro ao buscar informação da linha {line_id}: {e}")
        return None
    finally:
        if conn:
            conn.close()

def get_product_info(product_id):
    conn = None
    try:
        conn = get_postgres_connection()
        cur = conn.cursor()
        cur.execute("SELECT name FROM product_product WHERE id = %s", (product_id,))
        result = cur.fetchone()
        return result[0] if result else None
    except Exception as e:
        print(f"Erro ao buscar informação do produto {product_id}: {e}")
        return None
    finally:
        if conn:
            conn.close()

def get_station_info(station_id):
    conn = None
    try:
        conn = get_postgres_connection()
        cur = conn.cursor()
        cur.execute("SELECT name FROM line_stations_station WHERE id = %s", (station_id,))
        result = cur.fetchone()
        return result[0] if result else None
    except Exception as e:
        print(f"Erro ao buscar informação da estação {station_id}: {e}")
        return None
    finally:
        if conn:
            conn.close()

def enrich_raw_data(raw_data):
    # raw_data seria um dicionário ou objeto vindo do ESP32/Kafka
    # Exemplo: {'line_id': 1, 'product_id': 2, 'station_id': 3, 'quantity': 100, ...}
    
    enriched_data = raw_data.copy()
    
    if 'line_id' in raw_data:
        enriched_data['line_name'] = get_line_info(raw_data['line_id'])
    if 'product_id' in raw_data:
        enriched_data['product_name'] = get_product_info(raw_data['product_id'])
    if 'station_id' in raw_data:
        enriched_data['station_name'] = get_station_info(raw_data['station_id'])
        
    return enriched_data

if __name__ == '__main__':
    sample_raw_data = {'line_id': 1, 'product_id': 1, 'station_id': 1, 'quantity_completed': 10, 'registered_at': '2025-06-30 10:00:00'}
    enriched = enrich_raw_data(sample_raw_data)
    print("Dados brutos:", sample_raw_data)
    print("Dados enriquecidos:", enriched)