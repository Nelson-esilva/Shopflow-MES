import psycopg2
import db_credentials
from datetime import datetime, timezone, date, timedelta


def pop_production_order():
    
    # Conexão
    conn = psycopg2.connect(**db_credentials.db_config)
    cur = conn.cursor()

    # Dados de exemplo
    now = datetime.now(timezone.utc).isoformat(timespec='microseconds').replace("+00:00", "Z")

    today = date.today()
    start_date = today.isoformat()        # Data atual
    end_date = (today + timedelta(days=30)).isoformat()  # 30 dias depois

    production_orders_to_insert = [
    {
        'order_code': 'ORDER001',
        'quantity_meta': 10000,
        'quantity_planned': 8000,
        'quantity_completed': 5000,
        'start_date': start_date,
        'end_date': end_date,
        'status': 'empty',
        'created': now,
        'updated': now
    },
    {
        'order_code': 'ORDER002',
        'quantity_meta': 50000,
        'quantity_planned': 30000,
        'quantity_completed': 10000,
        'start_date': '2025-06-30',
        'end_date': '2025-07-30',
        'status': 'paused',
        'created': now,
        'updated': now
    },
    {
        'order_code': 'ORDER003',
        'quantity_meta': 75000,
        'quantity_planned': 40000,
        'quantity_completed': 25000,
        'start_date': '2025-06-30',
        'end_date': '2025-07-30',
        'status': 'completed',
        'created': now,
        'updated': now
    }
]

    # Query de insert
    insert_query = """
    INSERT INTO production_order_productionorder (
        order_code,
        quantity_meta,
        quantity_planned,
        quantity_completed,
        start_date,
        end_date,
        status,
        created,
        updated
    )
    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
    ON CONFLICT (order_code) DO NOTHING
    RETURNING id;
    """

    # Inserção dos dados
    for order in production_orders_to_insert:
        cur.execute(
            insert_query,
            (
                order['order_code'],
                order['quantity_meta'],
                order['quantity_planned'],
                order['quantity_completed'],
                order['start_date'],
                order['end_date'],
                order['status'],
                order['created'],
                order['updated']
            )
        )

        inserted = cur.fetchone()
        if inserted:
            print(f"✅ Inserido: {order['order_code']} (id={inserted[0]})")
        else:
            print(f"⚠️ Já existe (não inserido): {order['order_code']}")

    conn.commit()
    
    cur.close()
    conn.close()


if __name__ == '__main__':
    pop_production_order()