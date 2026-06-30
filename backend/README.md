# ShopFlow MES - Backend

API REST do sistema MES ShopFlow.

## Tecnologias

- Python 3.12, Django 5.2, DRF 3.16
- PostgreSQL 15 (dados operacionais)
- ClickHouse (dados analiticos)

## Estrutura

```
backend/
├── core/                  # Settings, URLs, exceptions
├── user/                  # Usuarios e permissoes
├── auth_jwt/              # Login JWT
├── auth_allauth/          # Google OAuth
├── product/               # Produtos
├── production_order/      # Ordens de producao
├── production_lines/      # Linhas e capacidades
├── line_stations/         # Estacoes
├── production_plan/       # Planos de producao
├── production_defect/     # Defeitos
├── clickhouse_data/       # Analytics (ClickHouse)
│   ├── client.py          # Conexao unica
│   ├── services.py        # Queries OLAP
│   └── views.py           # Endpoints REST
└── scripts/seed.py         # Seed PostgreSQL + ClickHouse
```

## Executando

```bash
docker compose up --build -d
docker exec -it backend-api bash -c "python scripts/seed.py"
```

## Endpoints principais

- Swagger: http://localhost:8000/api/schema/swagger-ui/
- Auth: `/api/auth/login/`, `/api/auth/profile/`, `/api/auth/change-password/`
- Producao: `/api/products/`, `/api/orders/`, `/api/lines/`, `/api/stations/`, `/api/plans/`
- Analytics: `/api/daily_workstation_relativo/`, `/api/dashboard/`

## Usuarios de teste

| Email                | Senha       |
|----------------------|-------------|
| admin@example.com    | admin123    |
| manager@example.com  | manager123  |
| operator@example.com | operator123 |
