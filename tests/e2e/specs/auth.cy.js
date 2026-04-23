describe('Autenticação', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('deve redirecionar para login quando não autenticado', () => {
    cy.url().should('include', '/login');
  });

  it('deve exibir formulário de login', () => {
    cy.visit('/login');
    cy.get('input[type="email"]').should('be.visible');
    cy.get('input[type="password"]').should('be.visible');
    cy.contains('Entrar').should('be.visible');
  });

  it('deve mostrar erro com credenciais inválidas', () => {
    cy.visit('/login');
    cy.get('input[type="email"]').type('invalido@test.com');
    cy.get('input[type="password"]').type('senhaerrada');
    cy.contains('Entrar').click();
    cy.get('.alert-danger').should('be.visible');
  });

  it('deve navegar para cadastro', () => {
    cy.visit('/login');
    cy.contains('Cadastre-se').click();
    cy.url().should('include', '/register');
  });

  it('deve exibir formulário de cadastro', () => {
    cy.visit('/register');
    cy.get('input[type="text"]').first().should('be.visible'); // nome
    cy.get('input[type="email"]').should('be.visible');
    cy.get('input[type="password"]').first().should('be.visible');
    cy.contains('Cadastrar').should('be.visible');
  });

  it('deve mostrar erro quando senhas não coincidem', () => {
    cy.visit('/register');
    cy.get('input[type="text"]').first().type('Teste');
    cy.get('input[type="email"]').type('teste@test.com');
    cy.get('input[type="password"]').first().type('123456');
    cy.get('input[type="password"]').last().type('654321');
    cy.contains('Cadastrar').click();
    cy.get('.alert-danger').should('contain', 'senhas não coincidem');
  });
});
