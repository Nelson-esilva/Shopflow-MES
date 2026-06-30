# ShopFlow MES - Frontend

Interface web do sistema MES ShopFlow, desenvolvida em React com Material-UI.

## Funcionalidades

- Dashboard interativo com graficos de producao
- Cadastro e gestao de produtos, ordens, linhas e planos
- Calendario visual de planos de producao
- Autenticacao JWT (Google OAuth preparado via `@react-oauth/google`)

## Tecnologias

- React 19 + Vite 6
- Material-UI 7
- Recharts, FullCalendar, Axios, React Toastify

## Estrutura

```
src/
├── services/apiClient.js   # Cliente HTTP unificado
├── contexts/AuthContext.jsx
├── components/             # Modulos por dominio
├── layout/
├── pages/
└── App.jsx
```

## Executando (via projeto raiz)

```bash
docker compose up --build -d
```

Acesse: http://localhost:5173

## Desenvolvimento local

```bash
npm install
npm run dev
```
