describe('Points Management', () => {
  beforeEach(() => {
    cy.login('test@example.com', 'Test123!');
    cy.visit('/points');
  });

  it('should display points balance', () => {
    cy.get('.text-3xl').should('exist');
  });

  it('should display voucher conversion options', () => {
    cy.get('.grid-cols-3').should('exist');
    cy.get('button').contains('Convert').should('exist');
  });

  it('should display transaction history', () => {
    cy.get('table').should('exist');
    cy.get('thead').contains('Points').should('exist');
    cy.get('thead').contains('Amount').should('exist');
  });
});
