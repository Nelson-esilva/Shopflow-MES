import psycopg2
import json
from datetime import datetime, timezone
import db_credentials


def pop_line_station():
    
    # Conexão
    conn = psycopg2.connect(**db_credentials.db_config)
    cur = conn.cursor()

    # Dados de exemplo
    registered_at = datetime.now(timezone.utc).isoformat(timespec='microseconds').replace("+00:00", "Z")

    # Dados fixos a serem inseridos
    line_stations_to_insert = [
        {
            "production_line": 1,
            "name": "Estação de Usinagem",
            "description": {
                "função": "Embalagem de componentes",
                "ferramentas": "Usinagem",
                "observações": ""
            },
            "current_status": True,
            "registered_at": registered_at,
            "num_employees": 5
        },
        {
            "production_line": 2,
            "name": "Estação de Montagem",
            "description": {
                "função": "Montagem final",
                "ferramentas": "Chave de impacto",
                "observações": "Requer EPI"
            },
            "current_status": True,
            "registered_at": registered_at,
            "num_employees": 8
        },
        {
            "production_line": 3,
            "name": "Estação de Pintura",
            "description": {
                "função": "Pintura de peças",
                "ferramentas": "Pistola de pintura",
                "observações": "Usar máscara respiratória"
            },
            "current_status": True,
            "registered_at": registered_at,
            "num_employees": 4
        },
        {
        "production_line": 1,
        "name": "Estação de Soldagem",
        "description": {
            "função": "Soldagem de peças metálicas",
            "ferramentas": "Máquina MIG",
            "observações": "Necessário treinamento específico"
        },
        "current_status": True,
        "registered_at": registered_at,
        "num_employees": 3
    },
        {
            "production_line": 2,
            "name": "Estação de Controle de Qualidade",
            "description": {
                "função": "Inspeção final de produtos",
                "ferramentas": "Instrumentos de medição",
                "observações": "Registrar dados em sistema"
            },
            "current_status": False,
            "registered_at": registered_at,
            "num_employees": 2
        },
        {
            "production_line": 3,
            "name": "Estação de Embalagem",
            "description": {
                "função": "Embalagem de produtos finalizados",
                "ferramentas": "Máquina seladora",
                "observações": "Separar por lote"
            },
            "current_status": True,
            "registered_at": registered_at,
            "num_employees": 6
        },
        {
            "production_line": 1,
            "name": "Estação de Corte",
            "description": {
                "função": "Corte de chapas metálicas",
                "ferramentas": "Guilhotina hidráulica",
                "observações": ""
            },
            "current_status": True,
            "registered_at": registered_at,
            "num_employees": 4
        },
        {
            "production_line": 2,
            "name": "Estação de Polimento",
            "description": {
                "função": "Polimento superficial de peças",
                "ferramentas": "Lixadeira elétrica",
                "observações": "Usar óculos de proteção"
            },
            "current_status": False,
            "registered_at": registered_at,
            "num_employees": 2
        },
        {
            "production_line": 3,
            "name": "Estação de Logística Interna",
            "description": {
                "função": "Movimentação interna de materiais",
                "ferramentas": "Paleteira elétrica",
                "observações": "Organizar área de estoque"
            },
            "current_status": True,
            "registered_at": registered_at,
            "num_employees": 5
        }
    ]

    # Query de insert sem registered_at
    insert_query = """
    INSERT INTO line_stations_linestation (
        production_line_id,
        name,
        description,
        current_status,
        registered_at,
        num_employees
    )
    VALUES (%s, %s, %s, %s, %s, %s)
    ON CONFLICT DO NOTHING
    RETURNING id;
    """

    # Inserção dos dados
    for station in line_stations_to_insert:
        cur.execute(
            insert_query,
            (
                station["production_line"],
                station["name"],
                json.dumps(station["description"], ensure_ascii=False),
                station["current_status"],
                station["registered_at"],
                station["num_employees"]
            )
        )

        inserted = cur.fetchone()
        if inserted:
            print(f"✅ Inserida: {station['name']} (id={inserted[0]})")
        else:
            print(f"⚠️ Já existe (não inserida): {station['name']}")

    conn.commit()

    # Exibe dados inseridos
    cur.execute("""
    SELECT id, production_line_id, name, description, current_status, registered_at, num_employees
    FROM line_stations_linestation
    ORDER BY id;
    """)
    
    cur.close()
    conn.close()


if __name__ == '__main__':
    pop_line_station()