# ShopFlow MES - ClickHouse

Configuracao do banco de dados OLAP ClickHouse para armazenamento analitico do ShopFlow MES.

## Estrutura

```
clickhouse/
├── clickhouse_init/
│   └── create_user.sh    # Script de inicializacao (usuario + tabelas)
├── .env.example
└── README.md
```

## Tabelas

### `workstation_records`

Registros brutos de producao por estacao de trabalho.

| Coluna              | Tipo              | Descricao                                  |
|---------------------|-------------------|--------------------------------------------|
| `record_id`         | UUID              | Identificador unico                        |
| `product_id`        | UInt32            | ID do produto                              |
| `production_line_id`| UInt16            | ID da linha de producao                    |
| `station_id`        | UInt16            | ID da estacao de trabalho                  |
| `production_plan_id`| UInt16            | ID do plano de producao                    |
| `defect_id`         | Nullable(UInt16)  | Codigo do defeito (se houver)              |
| `produced_quantity` | UInt16            | Quantidade produzida                       |
| `has_defect`        | UInt8             | Flag de defeito (0 ou 1)                   |
| `registered_at`     | DateTime          | Data/hora do registro                      |

- **Engine**: ReplacingMergeTree
- **Particionamento**: Mensal (toYYYYMM)
- **TTL**: 12 meses

### `daily_line_relativo_consolidado` e `daily_line_absoluto_consolidado`

Tabelas agregadas para dashboards analiticos. Criadas automaticamente pelo script de init.

## Conectando

```bash
# Via host
clickhouse-client --host 127.0.0.1 --port 9001 --user clickhouse_server_user --password shopflow_password --database production_data

# Via container
docker exec -it clickhouse clickhouse-client --user clickhouse_server_user --password shopflow_password --database production_data
```

## Populando dados

Os dados analiticos sao populados junto com o seed do PostgreSQL:

```bash
docker exec -it backend-api bash -c "python scripts/seed.py"
```
