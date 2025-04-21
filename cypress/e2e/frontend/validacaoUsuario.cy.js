import { CadastroUsuarioLoginPage } from '../../pageObjects/cadastroUsuarioLoginPage'
import { CadastroUsuarioAdminPage } from '../../pageObjects/cadastroUsuarioAdminPage'
import { LoginPage } from '../../pageObjects/loginPage'
import { ListaUsuariosPage } from '../../pageObjects/listaUsuariosPage'

const loginPage = new LoginPage()
const cadastroPage = new CadastroUsuarioLoginPage()
const cadastroUsuarioAdminPage = new CadastroUsuarioAdminPage()
const listaUsuariosPage = new ListaUsuariosPage()

let usuario

describe('Validação de Usuário', () => {
  it('Deve cadastrar um novo usuário como admin com sucesso pela tela de login', () => {
    cy.fixture('usuarios').then((user) => {

      const emailGerado = `joao${Date.now()}@teste.com`

      // Salva temporariamente para o próximo teste
      Cypress.env('emailNovoUsuario', emailGerado)
      Cypress.env('senhaNovoUsuario', user.novoUsuario.senha)

      cadastroPage.visitar()
      cadastroPage.preencherNome(user.novoUsuario.nome)
      cadastroPage.preencherEmail(emailGerado)
      cadastroPage.preencherSenha(user.novoUsuario.senha)
      cadastroPage.selecionarPerfil()
      cadastroPage.clicarCadastrar()
      cadastroPage.validarCadastroComSucesso()
      cy.screenshotWithTimestamp('cadastro-usuario')
    })
  })

  it('Deve cadastrar um novo usuário com sucesso logado como admin', () => {
    const email = Cypress.env('emailNovoUsuario')
    const senha = Cypress.env('senhaNovoUsuario')

    //Faz login com o usuário cadastrado anteriormente
    loginPage.visitar()
    loginPage.preencherEmail(email)
    loginPage.preencherSenha(senha)
    loginPage.clicarEntrar()
    loginPage.validarLoginComSucesso()


    //Gera nome e email aleatoriamente para gerar um novo usuário pela perfil de admin
    usuario = {
      nome: `Usuário ${Math.random().toString(36).substring(7)}`,
      email: `user_${Date.now()}@teste.com`,
      senha: 'Test1234',
      administrador: 'true'
    }

    //Preenche os campos obrigatórios e submete o cadastro do novo usuário
    cadastroUsuarioAdminPage.visitar()
    cadastroUsuarioAdminPage.preencherNome(usuario.nome)
    cadastroUsuarioAdminPage.preencherEmail(usuario.email)
    cadastroUsuarioAdminPage.preencherSenha(usuario.senha)
    cadastroUsuarioAdminPage.marcarAdmin(usuario.administrador)
    cadastroUsuarioAdminPage.submeterFormulario()

    // Screenshot para documentação
    cy.screenshotWithTimestamp('cadastro-usuario-adminpage-sucesso')
  })

  it('Deve encontrar e deletar o usuário cadastrado na lista', () => {

    cy.fixture('usuarios').then((user) => {
      const email = Cypress.env('emailNovoUsuario')
      //Logar com usuário admin padrão diferente do cadastrado anteriormente
      loginPage.visitar()
      loginPage.preencherEmail(user.loginValido.email)
      loginPage.preencherSenha(user.loginValido.senha)
      loginPage.clicarEntrar()
      loginPage.validarLoginComSucesso()

      listaUsuariosPage.visitar()
      listaUsuariosPage.buscarUsuarioPorEmail(email)
      listaUsuariosPage.validarUsuarioEncontrado(email)
      listaUsuariosPage.deletarUsuario(email)

      cy.screenshotWithTimestamp('usuario-deletado')
    })
  })

})