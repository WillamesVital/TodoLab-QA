describe('Fluxo de cadastro', () => {
  it('exibe a tela de cadastro', () => {
    cy.visitApp();

    cy.goToRegister();

    cy.get('[data-cy="register-form"]').should('be.visible');
    cy.get('[data-cy="register-form"] h2').should('have.text', 'Criar conta');
  });

  it('permite cadastrar um novo usuário válido', () => {
    cy.resetBackend();
    cy.visitApp();

    cy.goToRegister();


    cy.registerUser({
      name: 'Usuário Teste',
      email: 'teste.cadastro@example.com',
      password: 'SenhaSegura123',
    });

    cy.seeTodosScreen();
  });

  it('não permite cadastro com email já cadastrado', () => {
    cy.resetBackend();
    cy.visitApp();

    cy.goToRegister();
    cy.registerUser({
      name: 'Usuário Teste 1',
      email: 'duplicado@example.com',
      password: 'SenhaSegura123',
    });
    cy.seeTodosScreen();

    cy.logout();
    cy.seeLoginForm();
    cy.goToRegister();

    cy.registerUser({
      name: 'Usuário Teste 2',
      email: 'duplicado@example.com',
      password: 'SenhaSegura123',
    });

    cy.get('[data-cy="error-message"]').should('be.visible').and('contain', 'Email já cadastrado');
    cy.get('[data-cy="register-form"]').should('be.visible');
  });
});
