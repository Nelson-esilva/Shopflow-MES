import psycopg2
import db_credentials
from datetime import datetime, timezone


def pop_products():
    
    # Conexão
    conn = psycopg2.connect(**db_credentials.db_config)
    cur = conn.cursor()

    # Dados de exemplo
    now = datetime.now(timezone.utc).isoformat(timespec='microseconds').replace("+00:00", "Z")

    products_to_insert = [
        {
            "name": "Steel Rod",
            "model": "SR-100",
            "code": "PROD001",
            "product_type": "raw_material",
            "created": now,
            "updated": now
        },
        {
            "name": "Half-Processed Plate",
            "model": "HP-200",
            "code": "PROD002",
            "product_type": "semi_finished",
            "created": now,
            "updated": now
        },
        {
            "name": "Engine Block",
            "model": "EB-300",
            "code": "PROD003",
            "product_type": "finished",
            "created": now,
            "updated": now
        }
    ]

    # Inserção de dados
    insert_query = """
    INSERT INTO product_product (name, model, code, product_type, created, updated)
    VALUES (%s, %s, %s, %s, %s, %s)
    ON CONFLICT (code) DO NOTHING
    RETURNING id;
    """

    for product in products_to_insert:
        cur.execute(
            insert_query,
            (
                product['name'],
                product['model'],
                product['code'],
                product['product_type'],
                product['created'],
                product['updated']
            )
        )

        inserted = cur.fetchone()
        if inserted:
            print(f"✅ Inserido: {product['code']} (id={inserted[0]})")
        else:
            print(f"⚠️ Já existe (não inserido): {product['code']}")

    conn.commit()

    cur.close()
    conn.close()


if __name__ == '__main__':
    pop_products()