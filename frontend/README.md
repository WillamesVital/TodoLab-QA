# Frontend (Vite + React)

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

- `VITE_API_URL` (ex.: http://localhost:3001)

## Funcionalidades principais

- Login e logout com token em localStorage.
- Cadastro de usuário (fluxo de criação de conta).
- Listar todos do usuário autenticado.
- Adicionar todo.
- Marcar todo como done.
- Deletar todo.
- Exibir mensagens de erro em tela (`data-cy="error-message"`).

## Testes E2E (Cypress)

Estrutura:

- Specs em `cypress/e2e/`:
	- `smoke.cy.js` – verificação básica de login e acesso autenticado.
	- `cadastro.cy.js` – fluxo de cadastro (sucesso e email duplicado).
- Suporte e comandos em `cypress/support/`.
- Fixtures em `cypress/fixtures/`.

Comandos:

```bash
npm run cy:open
npm run cy:run
```

### Custom commands principais

Definidos em `cypress/support/commands.js`:

- `cy.resetBackend()`
	- Chama `POST /test/reset` na API.
	- Requer backend rodando com `NODE_ENV=test`.

- `cy.loginSession()`
	- Cria usuário de teste via API e faz login.
	- Usa `cy.session()` para reaproveitar sessão entre specs.

- `cy.visitApp()`, `cy.seeLoginForm()`, `cy.goToRegister()`
	- Encapsulam navegação básica entre tela de login e cadastro.

- `cy.registerUser({ name, email, password })`
	- Preenche e envia o formulário de cadastro.

- `cy.seeTodosScreen()`, `cy.logout()`
	- Validam tela autenticada e fluxo de saída.

Esses comandos foram extraídos a partir dos cenários de teste para reduzir duplicação e facilitar manutenção.

## Uso de IA no frontend

- A IA foi usada para:
	- Propor a estrutura inicial das specs de Cypress.
	- Evoluir as specs para usar `data-cy` reais do App.jsx.
	- Extrair fluxos repetitivos para custom commands reaproveitáveis.
- Diretrizes utilizadas:
	- Manter os seletores estáveis via `data-cy`.
	- Encapsular fluxos de negócio (login, cadastro, reset de backend) em funções de alto nível.
	- Evitar acoplamento a detalhes visuais, focando em comportamento.
