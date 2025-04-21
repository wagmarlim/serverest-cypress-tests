export class LoginPage {
    visitar() {
      cy.visit(Cypress.env('frontendUrl') + '/login')
    }
  
    preencherEmail(email) {
      cy.get('[data-testid=email]').type(email)
    }
  
    preencherSenha(senha) {
      cy.get('[data-testid=senha]').type(senha)
    }
  
    clicarEntrar() {
      cy.get('[data-testid=entrar]').click()
    }
  
    validarLoginComSucesso() {
      cy.url().should('include', '/admin/home')
      cy.contains('Bem Vindo').should('be.visible')
    }
  }
  