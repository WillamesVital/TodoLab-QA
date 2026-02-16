# Backend (API TodoLab QA)

API em Node.js/Express com SQLite focada em ser simples de testar.

## Stack

- Node.js + Express
- Banco SQLite via `better-sqlite3`
- Autenticação JWT (`jsonwebtoken`)
- Hash de senha com `bcrypt`

## Scripts

No diretório backend:

```bash
npm install
npm run dev    # desenvolvimento
npm start      # produção simples
npm test       # testes (Jest + Supertest)
```

O app é montado em app.js e servido por server.js na porta 3001.

## Principais rotas

- `GET /health` – status da API.
- `POST /auth/register` – cria usuário (name, email, password).
- `POST /auth/login` – autentica e devolve `{ token }`.
- `GET /todos` – lista todos do usuário autenticado.
- `POST /todos` – cria todo (`title`).
- `PATCH /todos/:id` – atualiza `title` e/ou `done`.
- `DELETE /todos/:id` – remove todo.
- `POST /test/reset` – limpa banco (apenas com `NODE_ENV=test`).

Detalhes de validação e regras estão em:

- [routes/auth.js](routes/auth.js)
- [routes/todos.js](routes/todos.js)

## Testes

Os testes de integração estão em [tests](tests):

- [tests/health.test.js](tests/health.test.js) – verifica `/health`.
- [tests/auth/register.test.js](tests/auth/register.test.js) – cenários de cadastro.
- [tests/auth/login.test.js](tests/auth/login.test.js) – cenários de login.
- [tests/todos/todos.test.js](tests/todos/todos.test.js) – fluxo completo de todos.

Mais detalhes em [tests/README.md](tests/README.md).

## Uso de IA no backend

- Geração assistida dos testes de integração (auth e todos) com foco em:
  - Cobrir caminhos de sucesso e erro.
  - Manter os testes determinísticos usando `resetDatabase()` antes de cada caso.
- Refino iterativo das mensagens de erro e regras de validação para ficarem claras e testáveis.
- A IA foi instruída a:
  - Não acoplar testes a detalhes internos (usar apenas HTTP + payload).
  - Manter uma convenção clara de mensagens de erro para facilitar assertions.
