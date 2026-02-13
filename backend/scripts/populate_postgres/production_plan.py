import psycopg2
import db_credentials
import json
from datetime import datetime, timezone, timedelta


def pop_production_plan():
    
    # Conexão
    conn = psycopg2.connect(**db_credentials.db_config)
    cur = conn.cursor()

    # Função para converter data brasileira para formato date
    def parse_brazilian_date(date_str):
        return datetime.strptime(date_str, "%d/%m/%Y").date()

    # Calcular data daqui a 15 dias
    today = datetime.now(timezone.utc).isoformat(timespec='microseconds').replace("+00:00", "Z")
    production_day = datetime.now() + timedelta(days=15)
    date_str = production_day.strftime("%d/%m/%Y")   # formato brasileiro dd/mm/yyyy

    # Dados de exemplo (seguindo exatamente o modelo fornecido)
    production_plans_to_insert = [
        {
            "created": today,
	        "updated": today,
            "plan_code": "PLAN001",
            "production_day": date_str,
            "shifts": {
                "Evening": {
                    "total_quantity_per_shift": 700,
                    "init_time": "19:00",
                    "stop_time": "23:00"
                },
                "Morning": {
                    "total_quantity_per_shift": 500,
                    "init_time": "07:00",
                    "stop_time": "11:59"
                },
                "Afternoon": {
                    "total_quantity_per_shift": 300,
                    "init_time": "13:00",
                    "stop_time": "17:59"
                }
            },
            "total_quantity": 1500,
            "status": "planned",
            "previous_status": "planned",
            "product_order": 1,
            "product": 1,
            "production_line": 1
        },
        {
            "created": today,
	        "updated": today,
            "plan_code": "PLAN002",
            "production_day": date_str,
            "shifts": {
                "Morning": {
                    "total_quantity_per_shift": 800,
                    "init_time": "06:00",
                    "stop_time": "12:00"
                },
                "Afternoon": {
                    "total_quantity_per_shift": 1000,
                    "init_time": "13:00",
                    "stop_time": "18:00"
                }
            },
            "total_quantity": 1800,
            "status": "in_progress",
            "previous_status": "planned",
            "product_order": 2,
            "product": 2,
            "production_line": 2
        },
        {
            "created": today,
	        "updated": today,
            "plan_code": "PLAN003",
            "production_day": date_str,
            "shifts": {
                "Evening": {
                    "total_quantity_per_shift": 2000,
                    "init_time": "18:00",
                    "stop_time": "22:00"
                }
            },
            "total_quantity": 2000,
            "status": "completed",
            "previous_status": "planned",
            "product_order": 3,
            "product": 3,
            "production_line": 3
        }
    ]

    # Query de insert
    insert_query = """
    INSERT INTO production_plan_productionplan (
        created,
	    updated,
        plan_code,
        production_day,
        shifts,
        total_quantity,
        status,
        previous_status,
        product_order_id,
        product_id,
        production_line_id
    )
    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
    ON CONFLICT DO NOTHING
    RETURNING id;
    """

    # Inserção dos dados
    for plan in production_plans_to_insert:
        production_day = parse_brazilian_date(plan["production_day"])
        cur.execute(
            insert_query,
            (
                plan['created'],
                plan['updated'],
                plan["plan_code"],
                production_day,
                json.dumps(plan["shifts"], ensure_ascii=False),
                plan["total_quantity"],
                plan["status"],
                plan["previous_status"],
                plan["product_order"],
                plan["product"],
                plan["production_line"]
            )
        )

        inserted = cur.fetchone()
        if inserted:
            print(f"✅ Inserido: {plan['plan_code']} inserido")
        else:
            print(f"⚠️ Plano de Produção {plan['plan_code']} já existe")

    conn.commit()
    
    cur.close()
    conn.close()


if __name__ == '__main__':
    pop_production_plan()