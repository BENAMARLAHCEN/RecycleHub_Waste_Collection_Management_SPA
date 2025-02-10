describe('Authentication', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should successfully register a new user', () => {
    const testUser = {
      email: 'test@example.com',
      password: 'Test123!',
      firstName: 'Test',
      lastName: 'User',
      address: '123 Test St',
      city: 'Test City',
      phone: '1234567890',
      birthDate: '1990-01-01'
    };

    cy.register(testUser);
    cy.url().should('include', '/dashboard');
  });

  it('should successfully login', () => {
    cy.login('test@example.com', 'Test123!');
    cy.url().should('include', '/dashboard');
  });

  it('should display error for invalid login', () => {
    cy.login('invalid@email.com', 'wrongpassword');
    cy.get('.text-red-600').should('be.visible');
  });

  it('should successfully logout', () => {
    cy.login('test@example.com', 'Test123!');
    cy.get('button').contains('Sign out').click();
    cy.url().should('eq', Cypress.config().baseUrl + '/');
  });
});
