from clickhouse_connect import get_client as get_http_client
from clickhouse_driver import Client as NativeClient
from tabulate import tabulate
import socket

# ⚙️ Configuração dos nós ClickHouse
NODES = [
    {
        "nome": "Servidor Local",
        "host": "localhost",
        "usuarios": [
            {"username": "clickhouse_server_user", "password": "shopflow_password"}
        ],
    },
]

DATABASE = "production_data"
TABLE = "workstation_records"
PORT_HTTP = 8123
PORT_NATIVE = 9000


def testar_porta(host, port, timeout=3):
    """Testa se a porta está aberta"""
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as sock:
        sock.settimeout(timeout)
        try:
            sock.connect((host, port))
            return True
        except:
            return False


def testar_http_client(host, username, password, nome_conexao):
    """Testa conexão via HTTP na porta 8123"""
    print(f"\n🌐 [{nome_conexao}] Testando via HTTP (porta {PORT_HTTP})...")

    if not testar_porta(host, PORT_HTTP):
        print(f"❌ Porta {PORT_HTTP} indisponível no host {host}")
        return

    try:
        client = get_http_client(
            host=host,
            port=PORT_HTTP,
            username=username,
            password=password,
            database=DATABASE
        )
        print(f"✅ Conectado via HTTP ({host}:{PORT_HTTP})")

        query = f"SELECT * FROM {TABLE} ORDER BY registered_at DESC LIMIT 5"
        result = client.query(query)

        headers = result.column_names
        rows = result.result_rows

        if rows:
            print(tabulate(rows, headers=headers, tablefmt="fancy_grid"))
        else:
            print(f"⚠️ Nenhum dado encontrado em '{TABLE}'")

    except Exception as e:
        print(f"❌ Erro via HTTP: {e}")


def testar_native_client(host, username, password, nome_conexao):
    """Testa conexão nativa na porta 9000"""
    print(f"\n🔌 [{nome_conexao}] Testando via protocolo nativo (porta {PORT_NATIVE})...")

    if not testar_porta(host, PORT_NATIVE):
        print(f"❌ Porta {PORT_NATIVE} indisponível no host {host}")
        return

    try:
        client = NativeClient(
            host=host,
            port=PORT_NATIVE,
            user=username,
            password=password,
            database=DATABASE
        )
        print(f"✅ Conectado via protocolo nativo ({host}:{PORT_NATIVE})")

        query = f"SELECT * FROM {TABLE} ORDER BY registered_at DESC LIMIT 5"
        rows = client.execute(query)

        if rows:
            print(tabulate(rows, tablefmt="fancy_grid"))
        else:
            print(f"⚠️ Nenhum dado encontrado em '{TABLE}'")

    except Exception as e:
        print(f"❌ Erro na conexão nativa: {e}")


# 🚀 Loop de testes para cada servidor e usuário
for node in NODES:
    nome = node["nome"]
    host = node["host"]

    for usuario in node["usuarios"]:
        username = usuario["username"]
        password = usuario["password"]

        testar_http_client(host, username, password, f"{nome} - HTTP")
        testar_native_client(host, username, password, f"{nome} - Nativo TCP")