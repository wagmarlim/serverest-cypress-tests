import { LoginPage } from '../../pageObjects/loginPage'
import { ListaProdutosPage } from '../../pageObjects/listaProdutosPage'
import { CadastroProdutoPage } from '../../pageObjects/cadastroProdutoPage'


const loginPage = new LoginPage()
const produtosPage = new ListaProdutosPage()
const cadastroProdutoPage = new CadastroProdutoPage()

// ⬇️ Variável disponível para todos os testes
let produto

describe('Validação de Produtos', () => {

    it('Deve cadastrar um novo produto com sucesso', () => {
        cy.fixture('usuarios').then((user) => {
            produto = {
                nome: `Produto ${Math.random().toString(36).substring(7)}`,
                preco: Math.floor(Math.random() * 500) + 50,
                descricao: `Descrição gerada ${Date.now()}`,
                quantidade: Math.floor(Math.random() * 50) + 1,
                imagem: 'produto.png',

            }
            loginPage.visitar()
            loginPage.preencherEmail(user.loginValido.email)
            loginPage.preencherSenha(user.loginValido.senha)
            loginPage.clicarEntrar()
            loginPage.validarLoginComSucesso()
            cadastroProdutoPage.acessarPaginaDeCadastro()
            cadastroProdutoPage.preencherFormulario(produto)
            cadastroProdutoPage.submeterFormulario()
        })
    })

    it('Deve exibir na lista de produtos o novo produto cadastrado e excluir o produto', () => {
        cy.fixture('usuarios').then((user) => {
            loginPage.visitar()
            loginPage.preencherEmail(user.loginValido.email)
            loginPage.preencherSenha(user.loginValido.senha)
            loginPage.clicarEntrar()
            loginPage.validarLoginComSucesso()
            produtosPage.visitar()
            produtosPage.validarTabelaProdutosVisivel()
            produtosPage.validarProdutoNaLista(produto.nome)
            produtosPage.buscarProdutoPorNome(produto.nome)
            cy.screenshotWithTimestamp('lista-produto-cadastrado')
            produtosPage.deletarProduto(produto.nome)
            cy.screenshotWithTimestamp('lista-produto-excluido')
        })
    })
})