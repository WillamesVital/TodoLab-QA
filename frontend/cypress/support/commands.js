const TOKEN_KEY = 'todolab_token';

Cypress.Commands.add('resetBackend', () => {
  const apiUrl = Cypress.env('apiUrl');

  cy.request({
    method: 'POST',
    url: `${apiUrl}/test/reset`,
    failOnStatusCode: false,
  }).then((response) => {
    if (response.status !== 204) {
      throw new Error(
        `Falha ao resetar backend: status ${response.status}. Rode o backend com NODE_ENV=test para habilitar /test/reset.`
      );
    }
  });
});

Cypress.Commands.add('loginSession', (options = {}) => {
  const apiUrl = Cypress.env('apiUrl');
  const suffix = Date.now();
  const email = options.email || `e2e_user_${suffix}@example.com`;
  const password = options.password || '123456';
  const name = options.name || 'E2E User';

  cy.session([email], () => {
    cy.request({
      method: 'POST',
      url: `${apiUrl}/auth/register`,
      body: { name, email, password },
      failOnStatusCode: false,
    }).then((response) => {
      expect([201, 409]).to.include(response.status);
    });

    cy.request('POST', `${apiUrl}/auth/login`, { email, password }).then((response) => {
      expect(response.status).to.equal(200);
      expect(response.body.token).to.be.a('string').and.not.empty;

      cy.visit('/');
      cy.window().then((window) => {
        window.localStorage.setItem(TOKEN_KEY, response.body.token);
      });
    });
  }, {
    validate() {
      cy.visit('/');
      cy.window().then((window) => {
        const token = window.localStorage.getItem(TOKEN_KEY);
        expect(token).to.be.a('string').and.not.empty;
      });
    },
  });

  cy.visit('/');
});
