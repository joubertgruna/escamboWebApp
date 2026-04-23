/// <reference types="cypress" />

describe('🎯 Escambo - Full User Journey E2E Tests', () => {
  const baseUrl = 'http://localhost:3001';
  const testUser = {
    name: `User-${Date.now()}`,
    email: `test-${Date.now()}@escambo.com`,
    password: 'Test@123456'
  };

  beforeEach(() => {
    cy.visit(baseUrl);
    cy.window().then((win) => {
      // Limpar localStorage antes de cada teste
      win.localStorage.clear();
    });
  });

  it('✅ [1] Deve acessar a página inicial sem erros', () => {
    cy.visit(baseUrl);
    cy.contains('Escambo', { timeout: 5000 }).should('be.visible').or('contain', 'Troca');
    cy.screenshot('01-homepage');
  });

  it('✅ [2] Deve registrar um novo usuário', () => {
    cy.visit(`${baseUrl}/auth/register`);
    
    // Preencher formulário
    cy.get('input[name="name"]', { timeout: 5000 }).type(testUser.name);
    cy.get('input[name="email"]').type(testUser.email);
    cy.get('input[name="password"]').type(testUser.password);
    cy.get('input[name="confirmPassword"]').type(testUser.password);
    
    // Submeter
    cy.get('button[type="submit"]').click();
    
    // Verificar sucesso
    cy.contains('sucesso', { matchCase: false }).or('contain', 'bem-vindo').should('exist', { timeout: 10000 });
    cy.screenshot('02-registration-success');
  });

  it('✅ [3] Deve fazer login com as credenciais', () => {
    cy.visit(`${baseUrl}/auth/login`);
    
    // Preencher credenciais
    cy.get('input[name="email"]', { timeout: 5000 }).type(testUser.email);
    cy.get('input[name="password"]').type(testUser.password);
    
    // Submeter
    cy.get('button[type="submit"]').click();
    
    // Verificar que está autenticado
    cy.contains('Dashboard', { timeout: 10000 }).or('contain', 'Olá').should('exist');
    cy.screenshot('03-login-success');
  });

  it('✅ [4] Deve visualizar o dashboard após login', () => {
    // Fazer login primeiro
    cy.visit(`${baseUrl}/auth/login`);
    cy.get('input[name="email"]', { timeout: 5000 }).type(testUser.email);
    cy.get('input[name="password"]').type(testUser.password);
    cy.get('button[type="submit"]').click();
    
    // Aguardar dashboard
    cy.visit(`${baseUrl}/dashboard`, { timeout: 10000 });
    cy.get('h1, h2', { timeout: 5000 }).should('exist');
    cy.screenshot('04-dashboard');
  });

  it('✅ [5] Deve criar um novo item para troca', () => {
    // Login
    cy.visit(`${baseUrl}/auth/login`);
    cy.get('input[name="email"]', { timeout: 5000 }).type(testUser.email);
    cy.get('input[name="password"]').type(testUser.password);
    cy.get('button[type="submit"]').click();
    
    // Navegar para criar item
    cy.visit(`${baseUrl}/create-item`, { timeout: 10000 });
    
    // Preencher formulário
    cy.get('input[name="title"]', { timeout: 5000 }).type('Bicicleta Mountain Bike');
    cy.get('textarea[name="description"]').type('Bicicleta em perfeito estado, pouco usada, com 21 marchas');
    cy.get('select[name="category"]').select('Sports');
    
    // Submeter
    cy.get('button').contains('Criar', { matchCase: false }).click();
    
    // Verificar sucesso
    cy.contains('criado', { matchCase: false, timeout: 10000 }).or('contain', 'sucesso').should('exist');
    cy.screenshot('05-create-item');
  });

  it('✅ [6] Deve listar itens no feed', () => {
    cy.visit(`${baseUrl}/items`);
    
    // Aguardar itens carregarem
    cy.get('[data-testid="item-card"], .item-card, article', { timeout: 5000 })
      .should('have.length.greaterThan', 0);
    
    cy.screenshot('06-items-feed');
  });

  it('✅ [7] Deve visualizar detalhes de um item', () => {
    cy.visit(`${baseUrl}/items`);
    
    // Clicar no primeiro item
    cy.get('[data-testid="item-card"], .item-card, article', { timeout: 5000 })
      .first()
      .click();
    
    // Verificar detalhes
    cy.get('h1, h2', { timeout: 5000 }).should('exist');
    cy.screenshot('07-item-details');
  });

  it('✅ [8] Deve dar like em um item', () => {
    // Login
    cy.visit(`${baseUrl}/auth/login`);
    cy.get('input[name="email"]', { timeout: 5000 }).type(testUser.email);
    cy.get('input[name="password"]').type(testUser.password);
    cy.get('button[type="submit"]').click();
    
    // Ir para feed
    cy.visit(`${baseUrl}/items`, { timeout: 10000 });
    
    // Encontrar botão de like e clicar
    cy.get('button').contains('Like', { matchCase: false }).or('contain', '❤️')
      .first()
      .click({ timeout: 5000 });
    
    // Verificar que like foi dado
    cy.contains('like', { matchCase: false, timeout: 5000 }).or('contain', 'removido').should('exist');
    cy.screenshot('08-like-item');
  });

  it('✅ [9] Deve visualizar notificações', () => {
    // Login
    cy.visit(`${baseUrl}/auth/login`);
    cy.get('input[name="email"]', { timeout: 5000 }).type(testUser.email);
    cy.get('input[name="password"]').type(testUser.password);
    cy.get('button[type="submit"]').click();
    
    // Ir para notificações
    cy.visit(`${baseUrl}/notifications`, { timeout: 10000 });
    
    // Verificar que notificações carregam
    cy.get('h1, h2', { timeout: 5000 }).should('exist');
    cy.screenshot('09-notifications');
  });

  it('✅ [10] Deve fazer logout', () => {
    // Login
    cy.visit(`${baseUrl}/auth/login`);
    cy.get('input[name="email"]', { timeout: 5000 }).type(testUser.email);
    cy.get('input[name="password"]').type(testUser.password);
    cy.get('button[type="submit"]').click();
    
    // Encontrar e clicar em logout
    cy.get('button, a').contains('Logout', { matchCase: false })
      .or('contain', 'Sair')
      .first()
      .click({ timeout: 5000 });
    
    // Verificar que voltou para login
    cy.url({ timeout: 5000 }).should('include', 'login').or('include', 'auth');
    cy.screenshot('10-logout');
  });

  it('✅ [11] Deve acessar o perfil do usuário', () => {
    // Login
    cy.visit(`${baseUrl}/auth/login`);
    cy.get('input[name="email"]', { timeout: 5000 }).type(testUser.email);
    cy.get('input[name="password"]').type(testUser.password);
    cy.get('button[type="submit"]').click();
    
    // Ir para perfil
    cy.visit(`${baseUrl}/profile`, { timeout: 10000 });
    
    // Verificar dados do perfil
    cy.get('h1, h2', { timeout: 5000 }).should('exist');
    cy.screenshot('11-profile');
  });

  it('✅ [12] Deve listar matches do usuário', () => {
    // Login
    cy.visit(`${baseUrl}/auth/login`);
    cy.get('input[name="email"]', { timeout: 5000 }).type(testUser.email);
    cy.get('input[name="password"]').type(testUser.password);
    cy.get('button[type="submit"]').click();
    
    // Ir para matches
    cy.visit(`${baseUrl}/matches`, { timeout: 10000 });
    
    // Verificar página de matches
    cy.get('h1, h2', { timeout: 5000 }).should('exist');
    cy.screenshot('12-matches');
  });

  it('✅ [13] Deve visualizar o menu de navegação', () => {
    cy.visit(baseUrl);
    
    // Verificar que menu existe
    cy.get('nav, header, [role="navigation"]', { timeout: 5000 }).should('exist');
    cy.screenshot('13-navigation-menu');
  });

  it('✅ [14] Deve responder corretamente a redimensionamentos de tela', () => {
    // Teste em mobile
    cy.viewport('iphone-x');
    cy.visit(baseUrl);
    cy.get('body').should('be.visible');
    cy.screenshot('14-mobile-view');
    
    // Teste em desktop
    cy.viewport('macbook-15');
    cy.visit(baseUrl);
    cy.get('body').should('be.visible');
    cy.screenshot('14-desktop-view');
  });

  it('✅ [15] Deve mostrar mensagens de erro apropriadas', () => {
    // Tentar login com credenciais inválidas
    cy.visit(`${baseUrl}/auth/login`);
    cy.get('input[name="email"]', { timeout: 5000 }).type('invalid@email.com');
    cy.get('input[name="password"]').type('wrongpassword');
    cy.get('button[type="submit"]').click();
    
    // Verificar mensagem de erro
    cy.contains('erro', { matchCase: false, timeout: 5000 })
      .or('contain', 'inválido')
      .should('exist');
    
    cy.screenshot('15-error-message');
  });
});
