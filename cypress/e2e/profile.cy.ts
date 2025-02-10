describe('Profile Management', () => {
  beforeEach(() => {
    cy.login('test@example.com', 'Test123!');
    cy.visit('/profile');
  });

  it('should display user profile information', () => {
    cy.get('input[formControlName="firstName"]').should('have.value', 'Test');
    cy.get('input[formControlName="lastName"]').should('have.value', 'User');
  });

  it('should update profile information', () => {
    cy.get('input[formControlName="phone"]').clear().type('9876543210');
    cy.get('button').contains('Save Changes').click();
    cy.get('.text-green-600').should('be.visible');
  });

  it('should handle profile photo upload', () => {
    cy.get('input[type="file"]').attachFile('test-photo.svg');
    cy.get('button').contains('Save Changes').click();
    cy.get('.text-green-600').should('be.visible');
  });
});
