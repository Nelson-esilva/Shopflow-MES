import os

from clickhouse_driver import Client


def get_clickhouse_client():
    return Client(
        host=os.environ.get("CLICKHOUSE_HOST", "clickhouse"),
        port=int(os.environ.get("CLICKHOUSE_PORT", "9000")),
        user=os.environ.get("CLICKHOUSE_USERNAME", "clickhouse_server_user"),
        password=os.environ.get("CLICKHOUSE_PASSWORD", "shopflow_password"),
        database=os.environ.get("CLICKHOUSE_DATABASE", "production_data"),
    )
