# ShopFlow MES - Grafana

Dashboards operacionais do ShopFlow MES com Grafana e datasource ClickHouse provisionado automaticamente.

## Estrutura

```
grafana/
├── clickhouse_init/
│   └── init.sh                           # Inicializacao do ClickHouse
├── grafana/
│   └── provisioning/
│       └── datasources/
│           └── clickhouse-datasource.yaml # Datasource ClickHouse auto-provisionado
├── .env.development
└── README.md
```

## Acesso

- URL: http://localhost:3000
- Login: `admin` / `admin`

## Datasource

O ClickHouse e configurado automaticamente via provisioning. Nenhuma configuracao manual necessaria.
