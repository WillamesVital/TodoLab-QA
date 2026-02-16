# Estrutura de Testes (Backend)

Esta pasta concentra a camada de testes automatizados da API backend usando **Jest** + **Supertest**.

## Estrutura atual

```text
backend/
  tests/
    README.md
    health.test.js
    auth/
      register.test.js
      login.test.js
    todos/
      todos.test.js
    helpers/
      resetDatabase.js
```

## Papéis de cada parte

- `health.test.js`
  - Teste de integração simples do endpoint `/health`.
  - Usa supertest para chamar o app Express sem subir servidor em porta.

- `auth/register.test.js`
  - Cobre cenários de cadastro de usuário (`POST /auth/register`).
  - Valida nome obrigatório, email inválido, senha curta e email duplicado.

- `auth/login.test.js`
  - Cobre cenários de login (`POST /auth/login`).
  - Valida credenciais corretas, ausência de campos e erros de autenticação.

- `todos/todos.test.js`
  - Exercita o fluxo completo de todos usando tokens reais:
    - Criação, listagem, atualização, deleção e acesso indevido a recursos de outro usuário.

- `helpers/resetDatabase.js`
  - Utilitário para manter os testes determinísticos.
  - Limpa tabelas `users` e `todos` e reseta sequências do SQLite.
  - Deve ser chamado em `beforeEach` nos arquivos de teste.

## Como executar

No diretório `backend`:

```bash
npm test
```

Script usado:

- `NODE_ENV=test jest --runInBand`

## Convenções adotadas

- Cada arquivo de teste deve ser independente.
- Evitar dependência de estado prévio.
- Preferir reset de banco antes de cada teste (`beforeEach`).
- Validar comportamento externo (status HTTP + payload), não detalhes internos de implementação.
