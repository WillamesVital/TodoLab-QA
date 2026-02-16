# TodoLab QA

Aplicação de gerenciamento de tarefas pensada para exercícios de qualidade de software, testes automatizados e uso guiado de IA.

---

## Visão geral da arquitetura

- Backend: Node.js + Express + SQLite, com autenticação JWT.
- Frontend: Vite + React, comunicação com a API via fetch.
- Banco: arquivo SQLite em backend/database.sqlite.
- Testes:
	- Backend: Jest + Supertest (integração de API).
	- Frontend: Cypress (E2E, fluxos completos).

Detalhes por pasta:

- [backend/README.md](backend/README.md) – API, rotas e testes de backend.
- [frontend/README.md](frontend/README.md) – SPA em React e testes E2E.

---

## Pré-requisitos

- Node.js v18+
- npm

---

## Como subir o ambiente

### 1. Backend

```bash
cd backend
npm install
npm run dev
```

Servidor padrão em http://localhost:3001.

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

Aplicação em http://localhost:3000.

### Resumo de portas

| Serviço  | URL                  |
|----------|----------------------|
| Backend  | http://localhost:3001 |
| Frontend | http://localhost:3000 |

---

## Testes

### Testes de API (Jest + Supertest)

```bash
cd backend
npm test
```

Roda todas as suites em backend/tests.

### Testes E2E (Cypress)

1. Backend em modo de teste (habilita POST /test/reset):

```bash
cd backend
set NODE_ENV=test && node server.js
```

2. Frontend em outro terminal:

```bash
cd frontend
npm run dev
```

3. Cypress em outro terminal:

```bash
cd frontend
npm run cy:open   # modo interativo
npm run cy:run    # modo headless
```

Mais detalhes em:

- [backend/tests/README.md](backend/tests/README.md)
- [frontend/README.md](frontend/README.md)

---

## Uso de IA no projeto

O projeto foi construído com apoio de IA (GitHub Copilot / GPT-5.1) seguindo algumas instruções claras:

- Foco em qualidade e testes:
	- Propor e refinar suites de Jest + Supertest para `/auth`, `/todos` e `/health`.
	- Criar specs de Cypress para smoke e fluxo de cadastro, com comandos customizados reutilizáveis.

- Padrões e convenções:
	- Manter testes determinísticos usando reset de banco (`resetDatabase()` no backend, `cy.resetBackend()` no frontend).
	- Usar seletores estáveis via atributos `data-cy` na UI.
	- Encapsular fluxos repetidos (login, cadastro, navegação) em funções/comandos.
	- Validar sempre comportamento observável (status HTTP, payload, DOM visível) e não detalhes internos.

- Limites da IA:
	- Não alterar regras de negócio sem justificativa.
	- Não adicionar dependências desnecessárias.
	- Manter README e documentação alinhados com o código existente.

Essas diretrizes foram usadas para guiar a geração de código e testes ao longo do projeto.

---

## Referências

- [PROJECT_SCOPE.md](PROJECT_SCOPE.md) – escopo funcional.
- [ROADMAP.md](ROADMAP.md) – planejamento de blocos.
