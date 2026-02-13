import psycopg2
import db_credentials


def pop_production_line():
    
    # Conexão
    conn = psycopg2.connect(**db_credentials.db_config)
    cur = conn.cursor()

    # Dados fixos a serem inseridos
    production_lines_to_insert = [
        {
            'name': 'Linha 1',
            'location': 'ShopFlow Factory',
            'qtd_stations': 0,
            'status': 'active'
        },
        {
            'name': 'Linha 2',
            'location': 'ShopFlow Factory',
            'qtd_stations': 0,
            'status': 'inactive'
        },
        {
            'name': 'Linha 3',
            'location': 'ShopFlow Factory',
            'qtd_stations': 0,
            'status': 'maintenance'
        }
    ]

    # Query de insert
    insert_query = """
    INSERT INTO production_lines_productionline (
        name,
        location,
        qtd_stations,
        status
    )
    VALUES (%s, %s, %s, %s)
    ON CONFLICT DO NOTHING
    RETURNING id;
    """

    # Inserção dos dados
    for line in production_lines_to_insert:
        cur.execute(
            insert_query,
            (
                line['name'],
                line['location'],
                line['qtd_stations'],
                line['status']
            )
        )

        inserted = cur.fetchone()
        if inserted:
            print(f"✅ Inserida: {line['name']} (id={inserted[0]})")
        else:
            print(f"⚠️ Já existe (não inserida): {line['name']}")

    conn.commit()

    cur.close()
    conn.close()


if __name__ == '__main__':
    pop_production_line()