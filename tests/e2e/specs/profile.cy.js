describe('Perfil do Usuário', () => {
  beforeEach(() => {
    cy.login();
    cy.visit('/profile');
  });

  it('deve exibir dados do perfil', () => {
    cy.get('.profile-view__avatar').should('be.visible');
    cy.contains('Editar Perfil').should('be.visible');
    cy.contains('Publicar Item').should('be.visible');
    cy.contains('Sair da Conta').should('be.visible');
  });

  it('deve navegar para edição de perfil', () => {
    cy.contains('Editar Perfil').click();
    cy.url().should('include', '/edit-profile');
  });

  it('deve fazer logout', () => {
    cy.contains('Sair da Conta').click();
    cy.url().should('include', '/login');
  });
});
