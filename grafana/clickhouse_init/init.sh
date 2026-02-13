#!/bin/bash
set -e

echo "Waiting for ClickHouse server to be ready..."
for i in $(seq 1 10); do
    clickhouse-client --host localhost --query "SELECT 1" > /dev/null 2>&1 && break
    echo "ClickHouse server not yet ready, waiting (attempt $i/10)..."
    sleep 3
done
echo "ClickHouse server is ready."

echo "Creating user 'clickhouse_server_user' and granting permissions on production_data..."
clickhouse-client --host localhost --query "
  CREATE USER IF NOT EXISTS clickhouse_server_user IDENTIFIED BY 'shopflow_password';
  GRANT ALL ON production_data.* TO clickhouse_server_user;
"

echo "Creating database 'production_data' if not exists..."
clickhouse-client --host localhost --query "CREATE DATABASE IF NOT EXISTS production_data;"

echo "Creating table 'workstation_records' in production_data..."
clickhouse-client --host localhost --database production_data --query "
  CREATE TABLE IF NOT EXISTS workstation_records
  (
    record_id UUID DEFAULT generateUUIDv4(),
    product_id UInt32,
    production_line_id UInt16,
    station_id UInt16,
    production_plan_id UInt16,
    defect_id Nullable(UInt16),
    produced_quantity UInt16,
    has_defect UInt8,
    registered_at DateTime64(3, 'America/Manaus'),
    data_sended Bool DEFAULT false
  )
  ENGINE = MergeTree
  PARTITION BY toYYYYMM(toDateTime(registered_at))
  ORDER BY (station_id, toDateTime(registered_at))
  TTL toDateTime(registered_at) + INTERVAL 12 MONTH DELETE
  SETTINGS index_granularity = 8192;
"

echo "User and table setup complete."
