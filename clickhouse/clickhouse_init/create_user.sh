#!/bin/bash
set -e

echo "Waiting for ClickHouse server to be ready..."
for i in $(seq 1 30); do
    clickhouse-client --host localhost --query "SELECT 1" > /dev/null 2>&1 && break
    echo "ClickHouse server not yet ready, waiting (attempt $i/30)..."
    sleep 3
done
echo "ClickHouse server is ready."

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
    registered_at DateTime
  )
  ENGINE = ReplacingMergeTree
  PARTITION BY toYYYYMM(toDateTime(registered_at))
  ORDER BY (record_id, station_id, toDateTime(registered_at))
  PRIMARY KEY (record_id, station_id)
  TTL toDateTime(registered_at) + INTERVAL 12 MONTH DELETE
  SETTINGS index_granularity = 8192;
"

echo "Creating table 'daily_line_relativo_consolidado'..."
clickhouse-client --host localhost --database production_data --query "
  CREATE TABLE IF NOT EXISTS daily_line_relativo_consolidado
  (
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
  )
  ENGINE = MergeTree()
  ORDER BY (id, registered_at);
"

echo "Creating table 'daily_line_absoluto_consolidado'..."
clickhouse-client --host localhost --database production_data --query "
  CREATE TABLE IF NOT EXISTS daily_line_absoluto_consolidado
  (
    id Int32,
    line_name String,
    station_name String,
    product_name String,
    production_order_name String,
    total_quantity_completed Int32,
    total_quantity_planned Int32,
    quantity_meta Int32,
    top_defects String,
    efficiency Decimal(5, 2),
    last_production_time Int32,
    registered_at DateTime
  )
  ENGINE = MergeTree()
  ORDER BY (id, registered_at);
"

echo "ClickHouse tables setup complete."
