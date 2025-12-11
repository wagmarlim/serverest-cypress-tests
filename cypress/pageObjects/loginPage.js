// Page Object para a página de login. Encapsula ações e verificações comuns do formulário.
export class LoginPage {
    // Navega até a rota de login configurada via env
    visitar() {
      cy.visit(Cypress.env('frontendUrl') + '/login')
    }

    // Preenche o campo de email (usando data-testid)
    preencherEmail(email) {
      cy.get('[data-testid=email]').type(email)
    }

    // Preenche o campo de senha
    preencherSenha(senha) {
      cy.get('[data-testid=senha]').type(senha)
    }

    // Clica no botão de entrar/submit
    clicarEntrar() {
      cy.get('[data-testid=entrar]').click()
    }

    // Validação comum para verificar que o login foi bem-sucedido
    validarLoginComSucesso() {
      cy.url().should('include', '/admin/home')
      cy.contains('Bem Vindo').should('be.visible')
    }
  }
  