describe('Collector Dashboard', () => {
  beforeEach(() => {
    // Login as collector
    cy.login('collector@example.com', 'Test123!');
    cy.visit('/dashboard');
  });

  it('should display collector statistics', () => {
    cy.get('.text-gray-500').contains('Total Collections').should('exist');
    cy.get('.text-gray-500').contains('Completed').should('exist');
    cy.get('.text-gray-500').contains('Pending').should('exist');
  });

  it('should display available requests', () => {
    cy.get('.text-lg').contains('Available Requests').should('exist');
  });

  it('should allow accepting a request', () => {
    cy.get('button').contains('Accept').first().click();
    cy.get('.text-green-600').should('be.visible');
  });

  it('should allow validating a collection', () => {
    cy.get('button').contains('Start Collection').first().click();
    cy.get('button').contains('Validate').should('exist');

    cy.get('input[formControlName="validatedWeight"]').type('5');
    cy.get('input[type="file"]').attachFile('validation-photo.svg');
    cy.get('button').contains('Complete Validation').click();

    cy.get('.text-green-600').should('be.visible');
  });
});
