describe('Feed de Itens', () => {
  beforeEach(() => {
    cy.login();
    cy.visit('/feed');
  });

  it('deve exibir o feed', () => {
    cy.contains('Descubra Itens').should('be.visible');
  });

  it('deve exibir filtros de categoria', () => {
    cy.contains('Todos').should('be.visible');
    cy.contains('Eletrônicos').should('be.visible');
  });

  it('deve filtrar por categoria', () => {
    cy.contains('Eletrônicos').click();
    cy.url().should('include', '/feed');
  });

  it('deve navegar para detalhes do item ao clicar', () => {
    cy.get('.feed-item').first().click();
    cy.url().should('include', '/item/');
  });
});

describe('Criar Item', () => {
  beforeEach(() => {
    cy.login();
    cy.visit('/create-item');
  });

  it('deve exibir formulário de criação', () => {
    cy.contains('Publicar Item').should('be.visible');
    cy.get('input[type="text"]').first().should('be.visible');
    cy.get('textarea').should('be.visible');
  });

  it('deve validar campos obrigatórios', () => {
    cy.get('button[type="submit"]').click();
    // HTML5 validation prevents submission
    cy.url().should('include', '/create-item');
  });
});
