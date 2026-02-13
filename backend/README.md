# ShopFlow MES - Backend

API REST do sistema MES ShopFlow, responsavel por:

- Autenticacao e gerenciamento de usuarios (JWT + Google OAuth)
- Cadastro de produtos e ordens de producao
- Configuracao de linhas e estacoes de producao
- Planos de producao com acompanhamento
- Integracao com ClickHouse para dados analiticos
- Processamento de eventos via Kafka

## Tecnologias

- Python 3.12
- Django 5.2 + Django REST Framework 3.16
- PostgreSQL 15
- Apache Kafka
- ClickHouse

## Executando (via projeto raiz)

```bash
# Na raiz do projeto
docker compose up --build -d
```

## Endpoints

- Swagger UI: http://localhost:8000/api/schema/swagger-ui/
- ReDoc: http://localhost:8000/api/schema/redoc/

## Usuarios de teste

| Email                | Senha       |
|----------------------|-------------|
| admin@example.com    | admin123    |
| manager@example.com  | manager123  |
| operator@example.com | operator123 |
