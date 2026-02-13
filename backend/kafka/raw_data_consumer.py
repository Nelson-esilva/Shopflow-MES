from quixstreams import Application
import json
import utils


def daily_summary_consumer():

    app = Application(
        broker_address="kafka_broker_1:9092",
        consumer_group="raw_data_consumer",
        auto_offset_reset="latest", 
        auto_create_topics=True,
    )  
    
    client = utils.init_clickhouse_connection()    
    
    with app.get_consumer() as consumer:
        consumer.subscribe(["raw_data_production"])

        while True:
            msg = consumer.poll(1)

            if msg is None:
                print("Waiting RAW DATA...")

            elif msg.error() is not None:
                print(msg.error())
            else:              
                print("RAW DATA RECIVED")
                value = json.loads(msg.value())
                obj = json.loads(value)

                if(utils.insert_raw_data(obj, client)):
                    consumer.store_offsets(msg) # bookmarker
               
                

if __name__ == "__main__":
    try:
        daily_summary_consumer()
    except KeyboardInterrupt:
        pass