// Page Object para a tela pública de cadastro (fluxo de login)
// Fornece ações para criar um usuário pelo formulário público e validar o resultado
export class CadastroUsuarioLoginPage {
    // Navega até a rota pública de cadastro
    visitar() {
      cy.visit(Cypress.env('frontendUrl') + '/cadastrarusuarios')
    }

    // Preenche o campo nome
    preencherNome(nome) {
      cy.get('[data-testid=nome]').type(nome)
    }

    // Preenche o campo email
    preencherEmail(email) {
      cy.get('[data-testid=email]').type(email)
    }

    // Preenche o campo senha
    preencherSenha(senha) {
      cy.get('[data-testid=password]').type(senha)
    }

    // Seleciona o perfil (checkbox) — usado para definir admin/usuário
    selecionarPerfil() {
      cy.get('[data-testid=checkbox]').click()
    }

    // Clica no botão de cadastrar
    clicarCadastrar() {
      cy.get('[data-testid=cadastrar]').click()
    }

    // Valida a mensagem de sucesso após cadastro
    validarCadastroComSucesso() {
      cy.contains('Cadastro realizado com sucesso').should('be.visible')
    }
  }