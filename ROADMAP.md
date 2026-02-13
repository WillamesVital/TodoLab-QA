
---

# 📄 ROADMAP.md

# TodoLab QA Roadmap

## Regras gerais de qualidade

* Manter o projeto **simples** e fácil de manter
* Evitar overengineering (nada de camadas excessivas)
* Separar claramente responsabilidades:

  * `app.js` configura a aplicação
  * `server.js` apenas inicia o servidor
  * `routes/` contém rotas
  * `middleware/` contém middlewares
  * `db.js` contém persistência e queries
* Respostas de erro padronizadas:

```json
{ "error": "mensagem" }
```

* Status HTTP coerentes e previsíveis
* Não depender de dados preexistentes
* Cada endpoint deve ser implementado de forma direta e legível

---

## Bloco 1 — Setup do repositório

**Objetivo:** estrutura base do projeto e comandos básicos.

Checklist:

* [ ] Criar pastas: `backend/` e `frontend/`
* [ ] Adicionar `PROJECT_SCOPE.md` e `ROADMAP.md` na raiz
* [ ] Definir portas padrão:

  * backend: `http://localhost:3001`
  * frontend: `http://localhost:3000`

Critério de pronto:

* [ ] Estrutura criada e commitada
* [ ] README mínimo com passos para rodar back e front

---

## Bloco 2 — Backend mínimo com Health + DB

**Objetivo:** API sobe e banco cria tabelas automaticamente.

Checklist:

* [ ] Criar Express app com:

  * `GET /health -> 200 { status: "ok" }`
* [ ] Implementar SQLite com criação de tabelas na inicialização:

  * `users`
  * `todos`
* [ ] Criar módulo `db.js` com prepared statements
* [ ] Criar `server.js` separado do `app.js`
* [ ] Configurar CORS para o frontend acessar

Critério de pronto:

* [ ] `npm run dev` inicia sem erro
* [ ] `GET /health` responde corretamente

---

## Bloco 3 — Auth (register + login + JWT)

**Objetivo:** autenticação completa e validada.

Checklist:

* [ ] POST `/auth/register` com validações:

  * email válido
  * senha >= 6
  * email único
* [ ] POST `/auth/login` com validações e token JWT
* [ ] bcrypt para password hash
* [ ] middleware `auth` que injeta `req.user`
* [ ] Padronizar respostas e erros

Critério de pronto:

* [ ] Fluxo register/login funciona manualmente (Postman/curl)
* [ ] Token inválido ou ausente retorna 401

---

## Bloco 4 — Todos (CRUD completo com ownership)

**Objetivo:** CRUD seguro e previsível.

Checklist:

* [ ] GET `/todos` retorna somente do usuário
* [ ] POST `/todos` valida title >= 3
* [ ] PATCH `/todos/:id` atualiza title e/ou done
* [ ] DELETE `/todos/:id` remove e retorna 204
* [ ] Garantir ownership:

  * todo não pertence ao usuário -> 403
  * todo não existe -> 404

Critério de pronto:

* [ ] CRUD completo funcionando com JWT
* [ ] Status codes corretos

---

## Bloco 5 — Frontend React (Vite) mínimo

**Objetivo:** UI simples e funcional.

Checklist:

* [ ] Criar Vite React app
* [ ] Criar `src/api.js` com fetch e baseURL `VITE_API_URL`
* [ ] Login:

  * email/password
  * salvar token no localStorage
  * exibir erro em tela
* [ ] Tela de todos:

  * listar
  * adicionar
  * marcar done
  * deletar
  * exibir erros em tela

Critério de pronto:

* [ ] Fluxo completo funciona manualmente:

  * register (via API ou simples tela)
  * login
  * CRUD de todos
* [ ] UI atualiza sem reload
* [ ] Erros aparecem na tela

---

## Bloco 6 — Refinos finais (qualidade e consistência)

**Objetivo:** polir para manter o projeto previsível.

Checklist:

* [ ] Padronizar mensagens de erro no backend
* [ ] Garantir respostas consistentes dos endpoints
* [ ] Garantir a compononentização dos elementos, com id, data-testId, classes corretas, roles e etc.
* [ ] Confirmar que o frontend trata erros e loading states
* [ ] Confirmar que o backend não vaza stack trace em respostas

Critério de pronto:

* [ ] Projeto roda sem ajustes manuais
* [ ] Fluxos principais estáveis e repetíveis

---

