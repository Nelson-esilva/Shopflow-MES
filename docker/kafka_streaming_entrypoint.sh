#!/bin/sh
set -e

cd /app

echo "Executando Kafka Streaming..."

#python /app/kafka/multitasking.py
python /app/kafka/daily_consumer/streaming.py 
#python /app/kafka/daily_consumer/daily_summary_consumer.py 

exec "$@"