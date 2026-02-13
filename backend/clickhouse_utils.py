from clickhouse_driver import Client
from dotenv import load_dotenv
import os
import time

load_dotenv()

class Utils:
    # time used for querys
    str_final_hour = ' 23:59:59'
    str_init_hour = ' 00:00:00'

    #default names for fields
    line_name = "line "
    station_name = "station "
    product_name = "product "
    product_order_name = "product order "

    def init_clickhouse_connection():
        config = {
            'host': os.environ.get("CLICKHOUSE_HOST_test"),
            'port': os.environ.get("CLICKHOUSE_PORT") ,
            'user': os.environ.get("CLICKHOUSE_USERNAME"),
            'password': os.environ.get("CLICKHOUSE_PASSWORD"),
            'database': os.environ.get("CLICKHOUSE_DATABASE"),
        }
     
        try:
            client = Client(**config)
            print("Conexão estabelecida com sucesso!")    
            return client 
        
        except Exception as e:        
            print(f"Error to connect: {e}")
            print("Trying to reconnect.....")
            time.sleep(5)
            Utils.init_clickhouse_connection()
    
    def close_clickhouse_conncection(client):
        client.disconnect()
        print("\nConexão encerrada.")

    def get_table(data, id, client):
        query = Utils.build_workstation_query(data, id)
        
        result = client.execute(query)
        return result 
    
    def build_workstation_query(data, id):
        conditions = []
       
        if('product_id' in data):
            conditions.append(f"product_id = {data['product_id']}")
      
        if ('production_line_id' in data):
            conditions.append(f"production_line_id = {data['production_line_id']}")
    
        if ('station_id' in data):
            conditions.append(f"station_id = {data['station_id']}")
    
        if (id is not None):
            conditions.append(f"production_plan_id = {id}")

        if ('registered_at' in data):
            init_date = data['registered_at'] + Utils.str_init_hour  
            final_date = data['registered_at'] + Utils.str_final_hour
            conditions.append(f"registered_at BETWEEN '{init_date}' AND '{final_date}'")

        where_clause = " AND ".join(conditions) if conditions else "1=1"

        query = f"""
        SELECT *
        FROM workstation_records
        WHERE {where_clause}
        ORDER BY registered_at DESC
        """
        
        return query

    def data_to_json(result, quantity_planned):
        json = []
        for data in result:
            json_data = {
                'record id': data[0],
                'line': Utils.line_name + str(data[2]),
                'station':Utils.station_name + str(data[3]),
                'product': Utils.product_name + str(data[1]),
                'product order' : Utils.product_order_name + str(data[4]),
                'quantity produced': data[6],
                'quantity defective' : data[6] * data[7],
                'registered at': data[8]
            }
            json.append(json_data)       
          
        return Utils.fpy_efficiency_calc(json, quantity_planned)
    
    def fpy_efficiency_calc(json, quantity_planned):
        total_produced = 0
        total_defective = 0 
        total_units = 0 
        fpy = 0
        efficiency = 0 

        for item in json:
            total_produced += item['quantity produced']
            total_defective += item['quantity defective']

        total_units = total_produced - total_defective
        if(total_produced != 0):
            fpy = round((total_units/total_produced) * 100, 2)

        if(quantity_planned != 0):
            efficiency = round((total_produced/quantity_planned) * 100, 2)
        
        json_fpy_efficiency = {
            'total produced': total_produced,
            'total good units': total_units,
            'total defective units': total_defective,
            'quantity planned': quantity_planned,            
            'FPY': fpy,
            'Efficiency_to_planned' : efficiency, 
        }

        json.append(json_fpy_efficiency)
        return json


#def clickhouse_tcp_connection(host = os.getenv("CLICKHOUSE_HOST_test"), port = os.getenv("CLICKHOUSE_PORT") , timeout=5):
#    try:
#        s = socket.create_connection((host, port), timeout)
#        s.close()
#        print("Connection to clickhouse successful.")
#        return True
#    except (socket.timeout, socket.error):
#        print("Failed to connect clickhouse")
#        return False

#def kafka_tcp_connection(host = os.getenv("KAFKA_HOST"), port = os.getenv("KAFKA_PORT"), timeout=5):
#    try:
#        s = socket.create_connection((host, port), timeout)
#        s.close()
#        print("Connection to KAFKA successful.")
#        return True
#    except (socket.timeout, socket.error):
#        print("Failed to connect KAFKA")
#        return False

