declare namespace Cypress {
  interface Chainable {
    login(email: string, password: string): void;
    register(userData: any): void;
  }
}

Cypress.Commands.add('login', (email: string, password: string) => {
  cy.visit('/auth/login');
  cy.get('input[formControlName="email"]').type(email);
  cy.get('input[formControlName="password"]').type(password);
  cy.get('button[type="submit"]').click();
});

Cypress.Commands.add('register', (userData) => {
  cy.visit('/auth/register');
  cy.get('input[formControlName="email"]').type(userData.email);
  cy.get('input[formControlName="password"]').type(userData.password);
  cy.get('input[formControlName="firstName"]').type(userData.firstName);
  cy.get('input[formControlName="lastName"]').type(userData.lastName);
  cy.get('input[formControlName="address"]').type(userData.address);
  cy.get('input[formControlName="city"]').type(userData.city);
  cy.get('input[formControlName="phone"]').type(userData.phone);
  cy.get('input[formControlName="birthDate"]').type(userData.birthDate);
  cy.get('button[type="submit"]').click();
});

