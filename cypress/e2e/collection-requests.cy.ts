describe('Collection Requests', () => {
  beforeEach(() => {
    cy.login('test@example.com', 'Test123!');
    cy.visit('/dashboard');
  });

  it('should create a new collection request', () => {
    cy.get('button').contains('New Collection Request').click();

    // Fill waste items
    cy.get('select[formControlName="type"]').select('Plastique');
    cy.get('input[formControlName="weight"]').type('5');

    // Fill collection details
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    cy.get('input[formControlName="collectionDate"]')
      .type(tomorrow.toISOString().split('T')[0]);
    cy.get('select[formControlName="timeSlot"]').select('09:00 - 10:00');

    cy.get('textarea[formControlName="address"]').type('123 Test St');
    cy.get('input[formControlName="city"]').type('Test City');

    cy.get('button[type="submit"]').click();
    cy.get('.text-green-600').should('be.visible');
  });

  it('should display user collection requests', () => {
    cy.get('app-request-list').should('exist');
    cy.get('app-request-list .bg-white').should('have.length.at.least', 1);
  });

  it('should allow editing a pending request', () => {
    cy.get('app-request-list .bg-white').first().within(() => {
      cy.get('button[title="Edit request"]').click();
    });

    cy.get('input[formControlName="weight"]').clear().type('3');
    cy.get('button').contains('Save Changes').click();
    cy.get('.text-green-600').should('be.visible');
  });
});
