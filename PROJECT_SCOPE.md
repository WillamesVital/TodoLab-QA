# 📄 PROJECT_SCOPE.md

# TodoLab QA

## 1. Objetivo do Projeto

TodoLab QA é uma aplicação simples de gerenciamento de tarefas desenvolvida com foco principal em:

* Prática de automação de testes
* Testes de API com Supertest
* Testes E2E com Cypress
* Isolamento e determinismo
* Boas práticas de arquitetura testável
* Uso estratégico de IA para aceleração de testes

A aplicação deve ser simples. O foco não é produto, é **qualidade e testes automatizados**.

---

## 2. Stack Tecnológica

### Backend

* Node.js
* Express
* SQLite (better-sqlite3)
* JWT para autenticação
* bcrypt para hash de senha
* Jest + Supertest para testes de API

### Frontend

* React (Vite)
* Fetch API
* Sem bibliotecas extras desnecessárias

### E2E

* Cypress

---

## 3. Escopo Funcional

### 3.1 Autenticação

#### POST /auth/register

Body:

```
{ name, email, password }
```

Regras:

* email deve ser válido
* password mínimo 6 caracteres
* email único
* retornar 201 com { id, name, email }

#### POST /auth/login

Body:

```
{ email, password }
```

Regras:

* credenciais válidas
* retornar 200 com { token }

---

### 3.2 Todos

Todas as rotas protegidas por JWT.

#### GET /todos

* Retorna somente tarefas do usuário autenticado

#### POST /todos

Body:

```
{ title }
```

Regras:

* title mínimo 3 caracteres
* done padrão false
* retornar 201

#### PATCH /todos/:id

Body:

```
{ title?, done? }
```

Regras:

* somente tarefas do próprio usuário
* validações aplicadas
* retornar 200

#### DELETE /todos/:id

* somente tarefas do próprio usuário
* retornar 204

---

### 3.3 Endpoint de Teste

#### POST /test/reset

* Disponível somente quando NODE_ENV=test
* Limpa todas as tabelas
* Retorna 204
* Nunca disponível em produção

---

## 4. Regras Gerais de Qualidade

### 4.1 Backend

* Sem ORM
* Sem arquitetura complexa
* Código modular e pequeno
* Separação clara:

  * app.js (configuração)
  * server.js (start)
  * routes/
  * middleware/
  * db.js
* Status HTTP corretos
* Mensagens de erro padronizadas:

```
{ error: "mensagem" }
```

---

### 4.2 Testes de API

* 100% determinísticos
* Reset do banco antes de cada teste
* Nenhum teste depende de outro
* Cobertura de:

  * happy path
  * validação
  * autorização
  * acesso indevido (403)
  * não encontrado (404)
* Não usar delays artificiais
* Não testar implementação interna, apenas comportamento externo

---

### 4.3 Frontend

* Código simples
* Token armazenado em localStorage
* Separação de API client em src/api.js
* Mensagens de erro visíveis na tela
* Elementos críticos devem conter atributo:

```
data-cy="..."
```

para estabilidade no Cypress

---

### 4.4 Testes E2E (Cypress)

* Não usar cy.wait(time)
* Usar cy.intercept() + alias
* Usar cy.session() para login
* Resetar banco antes de cada spec
* Testes independentes
* Validar UI e também comportamento de requisição
* Simular erro 500 via intercept e validar tratamento

---

### 4.5 Determinismo

O sistema deve:

* Não depender de ordem de execução
* Não depender de estado externo
* Não depender de dados preexistentes
* Permitir reset total a qualquer momento
* Executar testes repetidamente com o mesmo resultado

---

### 4.6 Uso de IA

A IA pode ser usada para:

* Gerar cenários de teste adicionais
* Gerar payloads inválidos
* Refatorar testes repetitivos
* Identificar possíveis pontos de flakiness
* Revisar estrutura de pastas

A IA NÃO deve:

* Criar lógica não solicitada
* Adicionar features fora do escopo
* Complexificar a arquitetura

---

## 5. Critérios de Pronto

Backend:

* Todos testes Jest passam
* Status codes corretos
* JWT funcionando
* Reset endpoint isolado

Frontend:

* Login funcional
* CRUD funcional
* Erros visíveis

E2E:

* Specs passam em modo headless
* Sem waits fixos
* Sem flakiness
* Intercepts configurados

---

## 6. Métrica de Sucesso

O projeto será considerado bem-sucedido quando:

* Executar `npm test` no backend sem falhas
* Executar `npx cypress run` sem falhas
* Rodar localmente sem inconsistências
* Conseguir rodar os testes 5 vezes seguidas com sucesso

---

## 7. Fora de Escopo

* Refresh token
* Roles avançadas
* Deploy
* Docker
* UI sofisticada
* Design system
* Cobertura de performance

---
