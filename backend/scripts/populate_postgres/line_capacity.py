import db_credentials
import psycopg2
from datetime import datetime, timedelta


def pop_line_capacity():
    
    # Conexão
    conn = psycopg2.connect(**db_credentials.db_config)
    cur = conn.cursor()

    # Calcula data 3 dias à frente
    date = (datetime.now() + timedelta(days=3)).strftime("%Y-%m-%d")

    # Dados a inserir
    records_to_insert = [
        {
            'date': date,
            'capacity': 5000,
            'production_line': 1,
            'product': 1
        },
        {
            'date': date,
            'capacity': 6000,
            'production_line': 2,
            'product': 2
        },
        {
            'date': date,
            'capacity': 7000,
            'production_line': 3,
            'product': 3
        }
    ]

    # Query INSERT
    insert_query = """
    INSERT INTO production_lines_productionlinecapacity (
        production_line_id,
        product_id,
        date,
        capacity
    )
    VALUES (%s, %s, %s, %s)
    ON CONFLICT (production_line_id, product_id, date) DO NOTHING
    RETURNING id;
    """

    # Inserção dos dados
    for record in records_to_insert:
        cur.execute(
            insert_query,
            (
                record['production_line'],
                record['product'],
                record['date'],
                record['capacity']
            )
        )
            
        inserted = cur.fetchone()
        if inserted:
            print(f"✅ Inserido: (id={inserted[0]})")
        else:
            print(f"⚠️ Já existe (não inserido): (id={inserted[0]})")
        
    conn.commit()
         
    cur.close()
    conn.close()


if __name__ == '__main__':
    pop_line_capacity()