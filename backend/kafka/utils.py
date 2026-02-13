from clickhouse_driver import Client
from dotenv import load_dotenv
import socket
import time
import os

load_dotenv()

db_host = os.getenv("CLICKHOUSE_HOST_test")
db_port = os.getenv("CLICKHOUSE_PORT")  
db_username = os.getenv("CLICKHOUSE_USERNAME")
db_password = os.getenv("CLICKHOUSE_PASSWORD")
db_database = os.getenv("CLICKHOUSE_DATABASE")

def init_clickhouse_connection():
    config = {
        'host': db_host,
        'port': db_port,
        'user': db_username,
        'password': db_password,
        'database': db_database,
    }
     
    try:
        client = Client(**config)
        print("Conexão estabelecida com sucesso!")    
        return client 
        
    except Exception as e:        
        print(f"Error to connect: {e}")
        print("Trying to reconnect.....")
        time.sleep(5)
        init_clickhouse_connection()


def insert_raw_data(value, client):
    try:
        # Converter o datetime dict para string formatada
        dt = value['registered_at']
        registered_at_str = f"{dt['year']}-{dt['month']:02d}-{dt['day']:02d} {dt['hour']:02d}:{dt['minute']:02d}:{dt['second']:02d}"
        
        # Construir a query SQL completa com valores formatados
        query = f"""
        INSERT INTO workstation_records 
        (record_id, product_id, production_line_id, station_id, 
         production_plan_id, defect_id, produced_quantity, 
         has_defect, registered_at)
        VALUES (
            '{str(value['record_id'])}',
            {int(value['product_id'])},
            {int(value['production_line_id'])},
            {int(value['station_id'])},
            {int(value['production_plan_id'])},
            {f"NULL" if value['defect_id'] is None else int(value['defect_id'])},
            {int(value['produced_quantity'])},
            {int(value['has_defect'])},
            '{registered_at_str}'
        )
        """
        
        client.execute(query)
        print(f"✅ Raw Data inserted: {value['record_id']}")
        return True
        
    except Exception as e:
        print(f"❌ Falha ao inserir {value.get('record_id', '')}: {str(e)}")
        return False
    
def close_clickhouse_conncection(client):
    client.disconnect()
    print("\nConexão encerrada.")

def clickhouse_tcp_connection(host = os.getenv("CLICKHOUSE_HOST_test"), port = os.getenv("CLICKHOUSE_PORT") , timeout=5):
    try:
        s = socket.create_connection((host, port), timeout)
        s.close()
        print("Connection to clickhouse successful.")
        return True
    except (socket.timeout, socket.error):
        print("Failed to connect clickhouse")
        return False

def kafka_tcp_connection(host = os.getenv("KAFKA_HOST"), port = os.getenv("KAFKA_PORT"), timeout=5):
    try:
        s = socket.create_connection((host, port), timeout)
        s.close()
        print("Connection to KAFKA successful.")
        return True
    except (socket.timeout, socket.error):
        print("Failed to connect KAFKA")
        return False

