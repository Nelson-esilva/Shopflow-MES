#!/bin/sh
set -e

cd /app

echo "Executando Kafka Consumer..."

python /app/kafka/raw_data_consumer.py 

exec "$@"