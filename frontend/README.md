# ShopFlow MES - Frontend

Interface web do sistema MES ShopFlow, desenvolvida em React com Material-UI.

## Funcionalidades

- Dashboard interativo com graficos de producao (radar, barra, pizza)
- Cadastro e gestao de produtos
- Gestao de ordens de producao com metas e prazos
- Configuracao de linhas e estacoes de producao
- Calendario visual de planos de producao
- Autenticacao JWT e Google OAuth

## Tecnologias

- React 19 + Vite 6
- Material-UI (MUI) 7
- Recharts, FullCalendar, Swiper
- Axios, Formik + Yup
- SASS

## Estrutura

```
src/
├── assets/          # Arquivos estaticos
├── components/      # Componentes reutilizaveis
├── contexts/        # Contextos globais (Auth, Theme)
├── layout/          # Estruturas de layout (Menu, Footer)
├── pages/           # Paginas da aplicacao
├── services/        # Servicos e chamadas API
├── styles/          # Estilos globais (SCSS/CSS)
├── App.jsx          # Componente principal
└── main.jsx         # Ponto de entrada
```

## Executando (via projeto raiz)

```bash
# Na raiz do projeto
docker compose up --build -d
```

Acesse: http://localhost:5173

## Desenvolvimento local (sem Docker)

```bash
npm install
npm run dev
```
