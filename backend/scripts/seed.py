#!/usr/bin/env python3
"""Seed de dados para PostgreSQL e ClickHouse."""

import json
import os
import random
import sys
from datetime import date, datetime, timedelta, timezone
from pathlib import Path

import psycopg2

BACKEND_ROOT = Path(__file__).resolve().parents[1]
if str(BACKEND_ROOT) not in sys.path:
    sys.path.insert(0, str(BACKEND_ROOT))


def pg_config():
    return {
        "dbname": os.environ.get("DB_NAME", os.environ.get("POSTGRES_DB", "postgres")),
        "user": os.environ.get("DB_USER", os.environ.get("POSTGRES_USER", "postgres")),
        "password": os.environ.get("DB_PASSWORD", os.environ.get("POSTGRES_PASSWORD", "postgres")),
        "host": os.environ.get("DB_HOST", os.environ.get("POSTGRES_HOST", "postgres")),
        "port": int(os.environ.get("DB_PORT", os.environ.get("POSTGRES_PORT", "5432"))),
    }


def _now_iso():
    return datetime.now(timezone.utc).isoformat(timespec="microseconds").replace("+00:00", "Z")


def _section(title, fn):
    print(f"=========== {title} ===========")
    fn()


def _insert_row(cur, query, values, label):
    cur.execute(query, values)
    inserted = cur.fetchone()
    if inserted:
        print(f"  Inserido: {label} (id={inserted[0]})")
    else:
        print(f"  Ja existe: {label}")


def seed_products():
    conn = psycopg2.connect(**pg_config())
    cur = conn.cursor()
    now = _now_iso()
    query = """
        INSERT INTO product_product (name, model, code, product_type, created, updated)
        VALUES (%s, %s, %s, %s, %s, %s)
        ON CONFLICT (code) DO NOTHING RETURNING id
    """
    for p in [
        ("Steel Rod", "SR-100", "PROD001", "raw_material"),
        ("Half-Processed Plate", "HP-200", "PROD002", "semi_finished"),
        ("Engine Block", "EB-300", "PROD003", "finished"),
    ]:
        _insert_row(cur, query, (*p, now, now), p[2])
    conn.commit()
    cur.close()
    conn.close()


def seed_orders():
    conn = psycopg2.connect(**pg_config())
    cur = conn.cursor()
    now = _now_iso()
    today = date.today()
    query = """
        INSERT INTO production_order_productionorder
        (order_code, quantity_meta, quantity_planned, quantity_completed,
         start_date, end_date, status, created, updated)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
        ON CONFLICT (order_code) DO NOTHING RETURNING id
    """
    for o in [
        ("ORDER001", 10000, 8000, 5000, today.isoformat(), (today + timedelta(days=30)).isoformat(), "empty"),
        ("ORDER002", 50000, 30000, 10000, "2025-06-30", "2025-07-30", "paused"),
        ("ORDER003", 75000, 40000, 25000, "2025-06-30", "2025-07-30", "completed"),
    ]:
        _insert_row(cur, query, (*o, now, now), o[0])
    conn.commit()
    cur.close()
    conn.close()


def seed_lines():
    conn = psycopg2.connect(**pg_config())
    cur = conn.cursor()
    query = """
        INSERT INTO production_lines_productionline (name, location, qtd_stations, status)
        VALUES (%s, %s, %s, %s) ON CONFLICT DO NOTHING RETURNING id
    """
    for line in [
        ("Linha 1", "ShopFlow Factory", 0, "active"),
        ("Linha 2", "ShopFlow Factory", 0, "inactive"),
        ("Linha 3", "ShopFlow Factory", 0, "maintenance"),
    ]:
        _insert_row(cur, query, line, line[0])
    conn.commit()
    cur.close()
    conn.close()


def seed_capacities():
    conn = psycopg2.connect(**pg_config())
    cur = conn.cursor()
    cap_date = (datetime.now() + timedelta(days=3)).strftime("%Y-%m-%d")
    query = """
        INSERT INTO production_lines_productionlinecapacity
        (production_line_id, product_id, date, capacity)
        VALUES (%s, %s, %s, %s)
        ON CONFLICT (production_line_id, product_id, date) DO NOTHING RETURNING id
    """
    for line_id, product_id, capacity in [(1, 1, 5000), (2, 2, 6000), (3, 3, 7000)]:
        _insert_row(cur, query, (line_id, product_id, cap_date, capacity), f"linha {line_id}")
    conn.commit()
    cur.close()
    conn.close()


def seed_stations():
    conn = psycopg2.connect(**pg_config())
    cur = conn.cursor()
    registered_at = _now_iso()
    query = """
        INSERT INTO line_stations_linestation
        (production_line_id, name, description, current_status, registered_at, num_employees)
        VALUES (%s, %s, %s, %s, %s, %s) ON CONFLICT DO NOTHING RETURNING id
    """
    stations = [
        (1, "Estacao de Usinagem", {"funcao": "Embalagem de componentes"}, True, 5),
        (2, "Estacao de Montagem", {"funcao": "Montagem final"}, True, 8),
        (3, "Estacao de Pintura", {"funcao": "Pintura de pecas"}, True, 4),
        (1, "Estacao de Soldagem", {"funcao": "Soldagem"}, True, 3),
        (2, "Estacao de Controle de Qualidade", {"funcao": "Inspecao"}, False, 2),
        (3, "Estacao de Embalagem", {"funcao": "Embalagem"}, True, 6),
        (1, "Estacao de Corte", {"funcao": "Corte"}, True, 4),
        (2, "Estacao de Polimento", {"funcao": "Polimento"}, False, 2),
        (3, "Estacao de Logistica Interna", {"funcao": "Logistica"}, True, 5),
    ]
    for line_id, name, desc, status, employees in stations:
        _insert_row(cur, query, (line_id, name, json.dumps(desc, ensure_ascii=False), status, registered_at, employees), name)
    conn.commit()
    cur.close()
    conn.close()


def seed_plans():
    conn = psycopg2.connect(**pg_config())
    cur = conn.cursor()
    now = _now_iso()
    production_day = (datetime.now() + timedelta(days=15)).strftime("%d/%m/%Y")
    day_parsed = datetime.strptime(production_day, "%d/%m/%Y").date()
    query = """
        INSERT INTO production_plan_productionplan
        (created, updated, plan_code, production_day, shifts, total_quantity,
         status, previous_status, product_order_id, product_id, production_line_id)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        ON CONFLICT DO NOTHING RETURNING id
    """
    plans = [
        ("PLAN001", {"Morning": {"total_quantity_per_shift": 500}}, 1500, "planned", 1, 1, 1),
        ("PLAN002", {"Morning": {"total_quantity_per_shift": 800}}, 1800, "in_progress", 2, 2, 2),
        ("PLAN003", {"Evening": {"total_quantity_per_shift": 2000}}, 2000, "completed", 3, 3, 3),
    ]
    for code, shifts, total, status, order_id, product_id, line_id in plans:
        _insert_row(
            cur, query,
            (now, now, code, day_parsed, json.dumps(shifts), total, status, "planned", order_id, product_id, line_id),
            code,
        )
    conn.commit()
    cur.close()
    conn.close()


def seed_users():
    conn = psycopg2.connect(**pg_config())
    cur = conn.cursor()
    now = datetime.now(timezone.utc).isoformat()
    query = """
        INSERT INTO user_user
        (name, username, email, password, cpf, phone, address, job_title,
         role, status, is_active, is_staff, is_superuser, last_access, deleted_at)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        ON CONFLICT (email) DO NOTHING RETURNING id
    """
    users = [
        ("Admin User", "admin", "admin@example.com",
         "pbkdf2_sha256$1000000$fixedsalt123$UpNaoVW4YsTjuWo/VVXPjD/74kOkt7mOmGCiiCuvRzA=",
         "000.000.000-00", "(11) 99999-9999", "Rua Exemplo, 123", "Administrador",
         "administrator", "active", True, True, True),
        ("Manager User", "manager1", "manager@example.com",
         "pbkdf2_sha256$1000000$fixedsalt123$Ld0JZSb3ef+Igm17ofTfYzCSmtaDnZ0rOV4fcYPFY8o=",
         "111.111.111-11", "(11) 98888-8888", "Av. Gerencial, 500", "Gerente",
         "manager", "active", True, False, False),
        ("Operator User", "operator1", "operator@example.com",
         "pbkdf2_sha256$1000000$fixedsalt123$bJquqZbSowYriW6qWkNuliDnVKRd9zQCrfVZKrcM0nY=",
         "222.222.222-22", "(11) 97777-7777", "Rua Operacional, 700", "Operador",
         "operator", "active", True, False, False),
    ]
    for u in users:
        _insert_row(cur, query, (*u, now, None), u[2])
    conn.commit()
    cur.close()
    conn.close()


def seed_defects():
    conn = psycopg2.connect(**pg_config())
    cur = conn.cursor()
    now = _now_iso()
    query = """
        INSERT INTO production_defect_productiondefect
        (created, updated, name, description, cause_solution, discard)
        VALUES (%s, %s, %s, %s, %s, %s) ON CONFLICT DO NOTHING RETURNING id
    """
    for d in [
        ("Risco na pintura", "Risco superficial", "Ajuste nos roletes.", False),
        ("Solda fria", "Falta de fusao", "Regular amperagem.", True),
        ("Trinca estrutural", "Rompimento parcial", "Reforco na estrutura.", True),
    ]:
        _insert_row(cur, query, (now, now, *d), d[0])
    conn.commit()
    cur.close()
    conn.close()


def seed_clickhouse():
    from clickhouse_data.client import get_clickhouse_client

    client = get_clickhouse_client()
    now = datetime.now()

    workstation_records = []
    for _ in range(60):
        has_defect = random.randint(0, 1)
        workstation_records.append((
            random.randint(1, 3), random.randint(1, 3), random.randint(1, 9),
            random.randint(1, 3),
            random.choice([None, random.randint(1, 5)]) if has_defect else None,
            random.randint(5, 50), has_defect,
            now - timedelta(hours=random.randint(0, 72)),
        ))
    client.execute(
        """INSERT INTO workstation_records
           (product_id, production_line_id, station_id, production_plan_id,
            defect_id, produced_quantity, has_defect, registered_at) VALUES""",
        workstation_records,
    )

    lines = ["Linha 1", "Linha 2", "Linha 3"]
    products = ["Steel Rod", "Half-Processed Plate", "Engine Block"]
    orders = ["ORDER001", "ORDER002", "ORDER003"]

    relativo = []
    absoluto = []
    for i in range(15):
        relativo.append((
            i + 1, random.choice(lines), random.choice(products), random.choice(orders),
            random.randint(50, 200), random.randint(100, 250), random.randint(10, 50),
            random.randint(300, 480), random.randint(10, 60),
            round(random.uniform(0.85, 0.99), 2), round(random.uniform(0.70, 0.95), 2),
            now - timedelta(days=random.randint(0, 7)),
        ))
        absoluto.append((
            i + 1, random.choice(lines), f"Estacao {random.randint(1, 9)}",
            random.choice(products), random.choice(orders),
            random.randint(100, 500), random.randint(200, 600), random.randint(10, 50),
            json.dumps({"defeito_superficie": random.randint(1, 10)}),
            round(random.uniform(0.70, 0.95), 2), random.randint(30, 120),
            now - timedelta(days=random.randint(0, 7)),
        ))

    client.execute("INSERT INTO daily_line_relativo_consolidado VALUES", relativo)
    client.execute("INSERT INTO daily_line_absoluto_consolidado VALUES", absoluto)
    client.disconnect()
    print("  ClickHouse populado.")


def main():
    steps = [
        ("Produtos", seed_products),
        ("Pedidos", seed_orders),
        ("Linhas de producao", seed_lines),
        ("Capacidades", seed_capacities),
        ("Estacoes", seed_stations),
        ("Planos", seed_plans),
        ("Usuarios", seed_users),
        ("Defeitos", seed_defects),
        ("Dados analiticos (ClickHouse)", seed_clickhouse),
    ]
    for title, fn in steps:
        _section(title, fn)


if __name__ == "__main__":
    main()
