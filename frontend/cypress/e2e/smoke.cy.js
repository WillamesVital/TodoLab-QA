describe('TodoLab frontend', () => {
  it('exibe a tela de login', () => {
    cy.visit('/');
    cy.get('[data-cy="login-form"]').should('be.visible');
    cy.contains('h1', 'TodoLab QA').should('be.visible');
  });

  it('permite acessar tela autenticada com cy.session', () => {
    cy.resetBackend();
    cy.loginSession();
    cy.get('[data-cy="todos-screen"]').should('be.visible');
  });
});
