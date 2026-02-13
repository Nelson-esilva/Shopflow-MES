# ✅ CLICKHOUSE ⇄ KAFKA SINCRONIZAÇÃO COMPLETA

# 📦 Estrutura de arquivos sugerida:
# /sync/
#   |- producer.py
#   |- consumer.py
#   |- reconciliation.sql
#   |- kafka-compose.yml

# ------------------------------------------------------------
# 📥 PRODUCER.PY — Lê ClickHouse local e envia para Kafka
# ------------------------------------------------------------

# producer.py
import json
import time
import uuid
from kafka import KafkaProducer
from clickhouse_connect import get_client

producer = KafkaProducer(
    bootstrap_servers='localhost:9092',  # Kafka local
    value_serializer=lambda v: json.dumps(v).encode('utf-8'),
    acks='all',  # Aguarda confirmação de todos os brokers
    retries=5
)

clickhouse = get_client(
    host='localhost',
    database='production_data'
)

query = '''
SELECT *
FROM workstation_records
WHERE record_id NOT IN (SELECT record_id FROM sync_log WHERE status = 'sent')
LIMIT 1000
'''

while True:
    rows = clickhouse.query(query).named_results()
    if not rows:
        print("✅ Nenhum dado novo para enviar.")
        time.sleep(5)
        continue

    for row in rows:
        try:
            # Envia para Kafka
            producer.send('workstation_topic', row).get(timeout=10)

            # Registra no log local como 'sent'
            clickhouse.command(f"""
                INSERT INTO sync_log (record_id, status)
                VALUES ('{row['record_id']}', 'sent')
            """)
            print(f"✅ Enviado: {row['record_id']}")

        except Exception as e:
            print(f"❌ Erro ao enviar {row['record_id']}: {str(e)}")

    time.sleep(1)