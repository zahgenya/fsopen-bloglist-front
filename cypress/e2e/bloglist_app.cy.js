describe('Blog app', function () {
  beforeEach(function () {
    cy.request('POST', `${Cypress.env('BACKEND')}/testing/reset`);
    const user = {
      username: 'testUser',
      name: 'Test User',
      password: 'test123',
    };
    cy.request('POST', `${Cypress.env('BACKEND')}/users`, user);
    cy.visit('');
  });

  it('login form can be opened', function () {
    cy.contains('log in').click();
    cy.get('#username').type('testUser');
    cy.get('#password').type('test123');
    cy.get('#login-button').click();

    cy.contains('Test User logged in');
  });

  describe('When logged in', function () {
    beforeEach(function () {
      cy.login({ username: 'testUser', password: 'test123' });
    });

    it('a new blog can be created', function () {
      cy.contains('new blog').click();
      cy.get('#title').type('Cypress blog');
      cy.get('#author').type('Tom');
      cy.get('#url').type('cypress.com');
      cy.contains('save').click();
      cy.contains('Cypress blog');
    });

    describe('and a blog exists', function () {
      this.beforeEach(function () {
        cy.createBlog({
          title: 'Cypress test blog 1',
          author: 'Tom',
          url: 'cypress.com',
          likes: 2,
        });
        cy.createBlog({
          title: 'Cypress test blog 2',
          author: 'Tom',
          url: 'cypress.com',
          likes: 3,
        });
        cy.createBlog({
          title: 'Cypress test blog 3',
          author: 'Tom',
          url: 'cypress.com',
          likes: 5,
        });
      });

      it('can like blog', function () {
        cy.contains('Cypress test blog 3').parent().as('blogPost');
        cy.get('@blogPost').find('button').as('viewButton');
        cy.get('@viewButton').click();
        cy.contains('like').click();
        cy.contains('likes: 6');
      });

      it('can remove blog', function () {
        cy.contains('Cypress test blog 3').parent().as('blogPost');
        cy.get('@blogPost').find('button').as('viewButton');
        cy.get('@viewButton').click();
        cy.contains('remove').click();
        cy.get('Cypress test blog 3').should('not.exist');
      });

      it('check if there remove button when you logged out', function () {
        cy.contains('logout').click();
        cy.visit('');
        cy.contains('Cypress test blog 1').parent().as('blogPost');
        cy.get('@blogPost').find('button').as('viewButton');
        cy.get('@viewButton').click();
        cy.get('remove').should('not.exist');
      });

      it('check if most liked blog is first', function () {
        cy.get('.blog')
          .eq(0)
          .should('contain', 'Cypress test blog 3');
        cy.get('.blog')
          .eq(1)
          .should('contain', 'Cypress test blog 2');
        cy.get('.blog')
          .eq(2)
          .should('contain', 'Cypress test blog 1')
      });
    });
  });

  it('login fails with wrong password', function () {
    cy.contains('log in').click();
    cy.get('#username').type('testUser');
    cy.get('#password').type('wrong');
    cy.get('#login-button').click();

    cy.get('.error')
      .should('contain', 'Wrong credentials')
      .and('have.css', 'color', 'rgb(255, 0, 0)');
  });
});
