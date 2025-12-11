import { LoginPage } from '../../pageObjects/loginPage'
import { CadastroUsuarioLoginPage } from '../../pageObjects/cadastroUsuarioLoginPage'

const loginPage = new LoginPage()
const cadastroLoginPage = new CadastroUsuarioLoginPage()

// Frontend: testes de login via UI. Cobrem sucesso, falhas de credenciais e validações de formulário.
describe('Frontend - Validações de Login', () => {
  let loginData

  // Carrega cenários de login inválido (fixture) antes da suite
  before(() => {
    cy.fixture('login').then((data) => {
      loginData = data
    })
  })

  // Cenário feliz: login com credenciais válidas deve redirecionar e mostrar mensagem
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

  // Senha inválida: UI deve exibir erro e usuário permanece na página de login
  it('Não deve logar com senha inválida', () => {
    loginPage.visitar()
    loginPage.preencherEmail(loginData.senhaInvalida.email)
    loginPage.preencherSenha(loginData.senhaInvalida.password)
    loginPage.clicarEntrar()
    cy.contains('Email e/ou senha inválidos').should('be.visible')
    cy.url().should('include', '/login')
  })

  // E-mail inexistente: mesmo comportamento de erro de autenticação na UI
  it('Não deve logar com e-mail inexistente', () => {
    loginPage.visitar()
    loginPage.preencherEmail(loginData.emailInvalido.email)
    loginPage.preencherSenha(loginData.emailInvalido.password)
    loginPage.clicarEntrar()
    cy.contains('Email e/ou senha inválidos').should('be.visible')
    cy.url().should('include', '/login')
  })

  // Campos vazios: verifica mensagens de validação apresentadas ao usuário
  it('Não deve logar com campos vazios', () => {
    loginPage.visitar()
    loginPage.clicarEntrar()
    cy.contains('Email é obrigatório').should('be.visible')
    cy.contains('Password é obrigatório').should('be.visible')
    cy.url().should('include', '/login')
  })

  // Cenários para usuário não-admin: registro público e login sem acesso ao admin
  it('Deve registrar e logar com usuário não-admin (fluxo público)', () => {
    const unique = Date.now()
    const nome = `Usuario NA ${unique}`
    const email = `na_${unique}@test.com`
    const senha = 'Senha123!'

    // Registrar via formulário público (não marcar checkbox de admin)
    cadastroLoginPage.visitar()
    cadastroLoginPage.preencherNome(nome)
    cadastroLoginPage.preencherEmail(email)
    cadastroLoginPage.preencherSenha(senha)
    cadastroLoginPage.clicarCadastrar()
    cadastroLoginPage.validarCadastroComSucesso()

    // Agora efetuar login com o usuário recém-criado
    loginPage.visitar()
    loginPage.preencherEmail(email)
    loginPage.preencherSenha(senha)
    loginPage.clicarEntrar()

    // Usuário não-admin não deve ser levado ao painel admin
    cy.url().should('not.include', '/admin/home')
    // Mensagem de boas-vindas do admin não deve existir
    cy.contains('Bem Vindo').should('not.exist')
  })

  it('Usuário não-admin não deve acessar rotas admin', () => {
    // Cria e loga um usuário não-admin rapidamente via UI (reuso de fluxo)
    const unique = Date.now() + 1
    const email = `na_${unique}@test.com`
    const senha = 'Senha123!'

    cadastroLoginPage.visitar()
    cadastroLoginPage.preencherNome(`Usuario NA ${unique}`)
    cadastroLoginPage.preencherEmail(email)
    cadastroLoginPage.preencherSenha(senha)
    cadastroLoginPage.clicarCadastrar()
    cadastroLoginPage.validarCadastroComSucesso()

    loginPage.visitar()
    loginPage.preencherEmail(email)
    loginPage.preencherSenha(senha)
    loginPage.clicarEntrar()

    // Tenta acessar rota admin de listagem de produtos
    cy.visit(Cypress.env('frontendUrl') + '/admin/listarprodutos')

    // Valida que a página de listagem admin não está visível para o usuário
    cy.get('table').should('not.exist')
  })
})