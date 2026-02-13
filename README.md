# TodoLab QA

Aplicação simples de gerenciamento de tarefas com foco em **qualidade e testes automatizados**.

---

## Pré-requisitos

- **Node.js** v18+
- **npm**

---

## Como subir o ambiente

### 1. Backend

```bash
cd backend
npm install
npm run dev
```

O servidor sobe em **http://localhost:3001**.

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

A aplicação sobe em **http://localhost:3000**.

### Resumo de portas

| Serviço  | URL                     |
|----------|-------------------------|
| Backend  | http://localhost:3001    |
| Frontend | http://localhost:3000    |

---

## Testes

### Testes de API (Jest + Supertest)

```bash
cd backend
npm test
```

### Testes E2E (Cypress)

Suba o backend em modo de teste (habilita `POST /test/reset`):

```bash
cd backend
set NODE_ENV=test && node server.js
```

Em outro terminal, suba o frontend:

```bash
cd frontend
npm run dev
```

Em outro terminal, rode o Cypress:

```bash
cd frontend
npx cypress open    # modo interativo
npx cypress run     # modo headless
```

---

## Documentação de testes

- [Estrutura de testes do backend](backend/tests/README.md)
- [Testes E2E com Cypress](frontend/README.md)

---

## Referências

- [PROJECT_SCOPE.md](PROJECT_SCOPE.md) — escopo funcional
- [ROADMAP.md](ROADMAP.md) — planejamento de blocos
