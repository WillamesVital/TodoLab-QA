# Frontend (Vite React)

Porta padrão: http://localhost:3000

## Setup

1. Criar arquivo de ambiente a partir do exemplo:

```bash
cp .env.example .env
```

2. Instalar dependências e rodar:

```bash
npm install
npm run dev
```

## Variável de ambiente

- `VITE_API_URL` (ex.: `http://localhost:3001`)

## Funcionalidades

- Login
- Listar todos
- Adicionar todo
- Marcar `done`
- Deletar todo
- Exibir erros em tela

## Testes E2E (Cypress)

Estrutura base criada em:

- `cypress/e2e/`
- `cypress/support/`
- `cypress/fixtures/`

Comandos:

```bash
npm run cy:open
npm run cy:run
```

Spec de exemplo:

- `cypress/e2e/smoke.cy.js`

Comando reutilizável de autenticação:

- `cy.loginSession()` em `cypress/support/commands.js`
- Usa `cy.session()` + login via API

Comando de reset do backend para determinismo:

- `cy.resetBackend()` em `cypress/support/commands.js`
- Chama `POST /test/reset`
- Requer backend rodando com `NODE_ENV=test`
