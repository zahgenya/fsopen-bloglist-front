describe('Blog app', function () {
  beforeEach(function () {
    cy.visit('http://localhost:5173');
  });

  it('front page can be opened', function () {
    cy.contains('Destructuring props in react');
    cy.contains('Canonical string reduction');
  });

  it('login form can be opened', function () {
    cy.contains('log in').click();
  });

  describe('When logged in', function () {
    beforeEach(function () {
      cy.contains('log in').click();
      cy.get('#username').type('testUser');
      cy.get('#password').type('test123');
      cy.get('#login-button').click();
    });

    it('a new blog can be created', function () {
      cy.contains('new blog').click();
      cy.get('#title').type('Cypress blog');
      cy.get('#author').type('Tom');
      cy.get('#url').type('cypress.com');
      cy.contains('save').click();
      cy.contains('Cypress blog');
    });

    it('created blog can be removed', function () {
      cy.contains('Cypress blog').click();
      cy.contains('#remove-button').click();
      cy.contains('Cypress blog').should('not.exist');
    })
  });
});
