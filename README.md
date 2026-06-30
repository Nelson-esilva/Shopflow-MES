# ShopFlow MES

**Manufacturing Execution System (MES)** open-source para gestao e monitoramento de producao industrial em tempo real.

O ShopFlow e um sistema MES/MOM (Manufacturing Operations Management) completo que integra coleta de dados do chao de fabrica, rastreamento de ordens de producao, analise de defeitos e dashboards analiticos em uma unica plataforma.

## Funcionalidades

- **Ordens de Producao** - Criacao, acompanhamento e gestao de ordens com metas e prazos
- **Linhas e Estacoes** - Configuracao de linhas de producao com estacoes detalhadas
- **Planos de Producao** - Calendario visual com monitoramento de progresso em tempo real
- **Dashboards Analiticos** - Graficos interativos (radar, barra, pizza) com dados OLAP
- **Controle de Qualidade** - Rastreamento de defeitos por estacao e produto
- **Gestao de Usuarios** - Autenticacao JWT, Google OAuth e controle de permissoes por role

## Arquitetura

```
Shopflow-MES/
├── backend/             # API REST (Django + DRF)
├── frontend/            # Interface Web (React + Vite + MUI)
├── clickhouse/          # Banco OLAP (ClickHouse)
├── docker/              # Dockerfiles e configuracoes Docker
├── backend/scripts/     # Seed de dados (PostgreSQL + ClickHouse)
├── docker-compose.yml   # Orquestracao de todos os servicos
└── README.md
```

### Stack Tecnologica

| Camada          | Tecnologia                              |
|-----------------|-----------------------------------------|
| Backend API     | Python 3.12, Django 5.2, DRF 3.16      |
| Frontend        | React 19, Vite 6, Material-UI 7        |
| Banco OLTP      | PostgreSQL 15                           |
| Banco OLAP      | ClickHouse (MergeTree, TTL, partitions) |
| Containers      | Docker, Docker Compose                  |
| Autenticacao    | JWT + Google OAuth 2.0                  |

### Diagrama de Servicos

```
                    ┌─────────────┐
                    │   Frontend  │ :5173
                    │  React/Vite │
                    └──────┬──────┘
                           │
                    ┌──────▼──────┐
                    │   Backend   │ :8000
                    │ Django/DRF  │
                    └──┬───────┬──┘
                       │       │
              ┌────────┘       └────────┐
              │                       │
       ┌──────▼──┐             ┌──────▼───────┐
       │PostgreSQL│             │  ClickHouse  │
       │  (OLTP)  │             │   (OLAP)     │
       └─────────┘             └──────────────┘
```

## Pre-requisitos

- [Docker](https://docs.docker.com/get-docker/) >= 24.0
- [Docker Compose](https://docs.docker.com/compose/install/) >= 2.20
- [Git](https://git-scm.com/)

## Como Rodar

### 1. Clonar o repositorio

```bash
git clone https://github.com/Nelson-esilva/shopflow-devops.git
cd shopflow-devops
```

### 2. Configurar variaveis de ambiente

Copie os arquivos `.env.example` para `.env` em cada pasta:

```bash
cp docker/.env.example docker/.env
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
cp clickhouse/.env.example clickhouse/.env
```

Edite os arquivos `.env` e preencha as credenciais necessarias (Google OAuth, SECRET_KEY, etc.).

> **Nota:** Os arquivos `.env` sao ignorados pelo Git e nunca devem ser versionados.

### 3. Subir todos os servicos

```bash
docker compose up --build -d
```

### 4. Popular os bancos com dados iniciais (seed)

```bash
docker exec -it backend-api bash -c "python scripts/seed.py"
```

O script popula o PostgreSQL (dados operacionais) e o ClickHouse (dados analiticos para os dashboards).

### 5. Acessar os servicos

| Servico         | URL                                              |
|-----------------|--------------------------------------------------|
| Frontend        | http://localhost:5173                             |
| Backend API     | http://localhost:8000                             |
| Swagger UI      | http://localhost:8000/api/schema/swagger-ui/      |
| ReDoc           | http://localhost:8000/api/schema/redoc/           |
| ClickHouse HTTP | http://localhost:8123                             |

### 6. Usuarios de teste

| Email                | Senha       | Role          |
|----------------------|-------------|---------------|
| admin@example.com    | admin123    | Administrador |
| manager@example.com  | manager123  | Gerente       |
| operator@example.com | operator123 | Operador      |

## Comandos Uteis

```bash
# Ver logs de todos os servicos
docker compose logs -f

# Ver logs de um servico especifico
docker logs -f backend-api

# Parar todos os containers
docker compose down

# Rebuild completo
docker compose up --build -d

# Remover volumes (reset total dos dados)
docker compose down -v
```

## Estrutura dos Servicos

### Backend (`/backend`)
API REST com Django e Django REST Framework. Gerencia usuarios, produtos, ordens de producao, linhas, estacoes e planos. Integra com ClickHouse para dados analiticos.

### Frontend (`/frontend`)
Aplicacao React com Vite e Material-UI. Dashboards interativos, calendario de planos de producao, gestao de ordens e visualizacao em tempo real.

### ClickHouse (`/clickhouse`)
Banco de dados OLAP para armazenamento analitico. Tabelas `workstation_records`, `daily_line_relativo_consolidado` e `daily_line_absoluto_consolidado` com particionamento e TTL.

## Licenca

Este projeto e disponibilizado para fins educacionais e de portfolio.
