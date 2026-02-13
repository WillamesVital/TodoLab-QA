# Estrutura de Testes (Backend)

Esta pasta concentra a camada de testes automatizados da API backend usando **Jest** + **Supertest**.

## Estrutura atual

```text
backend/
  tests/
    README.md
    health.test.js
    auth/
    todos/
    helpers/
      resetDatabase.js
```

## Papéis de cada parte

- `health.test.js`
  - Exemplo de teste de integração da API.
  - Usa `supertest` para chamar o app Express sem subir servidor em porta.

- `helpers/resetDatabase.js`
  - Utilitário para manter os testes determinísticos.
  - Limpa tabelas `users` e `todos` e reseta sequências do SQLite.
  - Pode ser chamado em `beforeEach` nos arquivos de teste.

- `auth/` e `todos/`
  - Pastas reservadas para futuras specs por domínio.
  - Objetivo: organizar cenários por contexto funcional.

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
