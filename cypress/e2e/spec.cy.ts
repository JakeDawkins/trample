const TEST_URL = 'http://localhost:3000';

describe('navigation using nav bar and links', () => {
  it('navigates to list page and search page with navbar', () => {
    cy.visit(TEST_URL);
    cy.contains('Next.js TS Apollo Template');
  });
});
