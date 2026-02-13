import psycopg2
import db_credentials
from datetime import datetime, timezone


def pop_production_defect():
    
    # Conexão
    conn = psycopg2.connect(**db_credentials.db_config)
    cur = conn.cursor()

    # Gera data/hora atual no formato ISO 8601 + Z
    now = datetime.now(timezone.utc).isoformat(timespec='microseconds').replace('+00:00', 'Z')

    # Dados a inserir
    production_defects_to_insert = [
        {
            "name": "Risco na pintura",
            "description": "Risco superficial no acabamento",
            "cause_solution": "Causa: atrito na esteira. Solução: ajuste nos roletes.",
            "discard": False,
            "created": now,
            "updated": now
        },
        {
            "name": "Solda fria",
            "description": "Falta de fusão na soldagem",
            "cause_solution": "Causa: corrente baixa. Solução: regular amperagem.",
            "discard": True,
            "created": now,
            "updated": now
        },
        {
            "name": "Trinca estrutural",
            "description": "Rompimento parcial do componente",
            "cause_solution": "Causa: vibração excessiva. Solução: reforço na estrutura.",
            "discard": True,
            "created": now,
            "updated": now
        }
    ]

    # Query de insert (com created e updated)
    insert_query = """
    INSERT INTO production_defect_productiondefect (
        created,
        updated,
        name,
        description,
        cause_solution,
        discard
    )
    VALUES (%s, %s, %s, %s, %s, %s)
    ON CONFLICT DO NOTHING
    RETURNING id;
    """

    # Inserção dos dados
    for defect in production_defects_to_insert:
        cur.execute(
            insert_query,
            (
                defect["created"],
                defect["updated"],
                defect["name"],
                defect["description"],
                defect["cause_solution"],
                defect["discard"]
            )
        )

        inserted = cur.fetchone()
        if inserted:
            print(f"✅ Inserido: {defect['name']} (id={inserted[0]})")
        else:
            print(f"⚠️ Já existe (não inserido): {defect['name']}")

    conn.commit()

    cur.close()
    conn.close()


if __name__ == '__main__':
    pop_production_defect()