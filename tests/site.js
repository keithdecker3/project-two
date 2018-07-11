describe('Tests that the application works properly' , () => {
  it('should navigate to and populate coins', () => {
    cy.visit('/')
    cy.get('.about-btn').click()
    cy.get('.top-coins').children('li').should('have.length', 10)
    cy.get('.top-coins li').eq(0).children().should('have.length', 4)
    cy.get('#icon_prefix').type('ETC', {force:true})
    cy.get('form').submit()
    cy.get('#search-heading').should('have.text', 'Ethereum Classic - ETC')
    cy.get('.search-coin').children().should('contain', 'Current Price', '24 Hour Change', '30 Day Change')
  })
})

