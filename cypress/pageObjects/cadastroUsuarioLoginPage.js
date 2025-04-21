export class CadastroUsuarioLoginPage {
    visitar() {
      cy.visit(Cypress.env('frontendUrl') + '/cadastrarusuarios')
    }
  
    preencherNome(nome) {
      cy.get('[data-testid=nome]').type(nome)
    }
  
    preencherEmail(email) {
      cy.get('[data-testid=email]').type(email)
    }
  
    preencherSenha(senha) {
      cy.get('[data-testid=password]').type(senha)
    }
  
    selecionarPerfil() {
      cy.get('[data-testid=checkbox]').click()
    }
  
    clicarCadastrar() {
      cy.get('[data-testid=cadastrar]').click()
    }
  
    validarCadastroComSucesso() {
      cy.contains('Cadastro realizado com sucesso').should('be.visible')
    }
  }