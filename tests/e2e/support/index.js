// Comandos customizados do Cypress

Cypress.Commands.add('login', (email = 'teste@escambo.com', password = '123456') => {
  cy.request('POST', '/api/auth/login', { email, password }).then((response) => {
    window.localStorage.setItem('escambo_token', response.body.data.token);
    window.localStorage.setItem('escambo_user', JSON.stringify(response.body.data.user));
  });
});

Cypress.Commands.add('register', (data) => {
  const userData = {
    name: 'Usuário Teste',
    email: `teste-${Date.now()}@escambo.com`,
    password: '123456',
    ...data,
  };
  cy.request('POST', '/api/auth/register', userData);
});
