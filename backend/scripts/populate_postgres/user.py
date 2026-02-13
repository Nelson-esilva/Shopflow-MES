import db_credentials
import os
import django
import psycopg2
from datetime import datetime, timezone


def pop_user():
    
    # Conexão
    conn = psycopg2.connect(**db_credentials.db_config)
    cur = conn.cursor()

    # Hora atual ISO
    now = datetime.now(timezone.utc).isoformat()

        # Dados dos usuários
    users_to_insert = [
        {
            "name": "Admin User",
            "username": "admin",
            "email": "admin@example.com",
            "password": "pbkdf2_sha256$1000000$fixedsalt123$UpNaoVW4YsTjuWo/VVXPjD/74kOkt7mOmGCiiCuvRzA=",  # admin123
            "cpf": "000.000.000-00",
            "phone": "(11) 99999-9999",
            "address": "Rua Exemplo, 123",
            "job_title": "Administrador",
            "role": "administrator",
            "status": "active",
            "is_active": True,
            "is_staff": True,
            "is_superuser": True,
            "last_access": now,
            "deleted_at": None
        },
        {
            "name": "Manager User",
            "username": "manager1",
            "email": "manager@example.com",
            "password": "pbkdf2_sha256$1000000$fixedsalt123$Ld0JZSb3ef+Igm17ofTfYzCSmtaDnZ0rOV4fcYPFY8o=",  # manager123
            "cpf": "111.111.111-11",
            "phone": "(11) 98888-8888",
            "address": "Av. Gerencial, 500",
            "job_title": "Gerente",
            "role": "manager",
            "status": "active",
            "is_active": True,
            "is_staff": False,
            "is_superuser": False,
            "last_access": now,
            "deleted_at": None
        },
        {
            "name": "Operator User",
            "username": "operator1",
            "email": "operator@example.com",
            "password": "pbkdf2_sha256$1000000$fixedsalt123$bJquqZbSowYriW6qWkNuliDnVKRd9zQCrfVZKrcM0nY=",  # operator123
            "cpf": "222.222.222-22",
            "phone": "(11) 97777-7777",
            "address": "Rua Operacional, 700",
            "job_title": "Operador",
            "role": "operator",
            "status": "active",
            "is_active": True,
            "is_staff": False,
            "is_superuser": False,
            "last_access": now,
            "deleted_at": None
        }
    ]

    # Query de insert
    insert_query = """
    INSERT INTO user_user (
        name,
        username,
        email,
        password,
        cpf,
        phone,
        address,
        job_title,
        role,
        status,
        is_active,
        is_staff,
        is_superuser,
        last_access,
        deleted_at
    )
    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
    ON CONFLICT (email) DO NOTHING
    RETURNING id;
    """

    for user in users_to_insert:

        cur.execute(
            insert_query,
            (
                user["name"],
                user["username"],
                user["email"],
                user['password'],
                user["cpf"],
                user["phone"],
                user["address"],
                user["job_title"],
                user["role"],
                user["status"],
                user["is_active"],
                user["is_staff"],
                user["is_superuser"],
                user["last_access"],
                user["deleted_at"]
            )
        )

        inserted = cur.fetchone()
        if inserted:
            print(f"✅ Inserido: {user['email']} ({user['role']})")
        else:
            print(f"⚠️ Já existe: {user['email']}")

    conn.commit()

    # Consulta os usuários inseridos
    cur.execute("""
    SELECT id, name, email, role, is_superuser
    FROM user_user
    ORDER BY id;
    """)

    cur.close()
    conn.close()


if __name__ == '__main__':
    pop_user()