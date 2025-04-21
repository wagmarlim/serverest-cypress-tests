import { LoginPage } from '../../pageObjects/loginPage'
const loginPage = new LoginPage()

describe('Login como usuário Admin', () => {
  it('Deve logar com sucesso', () => {
    cy.fixture('usuarios').then((user) => {
      loginPage.visitar()
      loginPage.preencherEmail(user.loginValido.email)
      loginPage.preencherSenha(user.loginValido.senha)
      loginPage.clicarEntrar()
      loginPage.validarLoginComSucesso()
      cy.screenshotWithTimestamp('login-com-sucesso')
    })
  })
})