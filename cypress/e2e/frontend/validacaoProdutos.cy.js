import { LoginPage } from '../../pageObjects/loginPage'
import { ListaProdutosPage } from '../../pageObjects/listaProdutosPage'
import { CadastroProdutoPage } from '../../pageObjects/cadastroProdutoPage'
import { CadastroUsuarioLoginPage } from '../../pageObjects/cadastroUsuarioLoginPage'


const loginPage = new LoginPage()
const produtosPage = new ListaProdutosPage()
const cadastroProdutoPage = new CadastroProdutoPage()
const cadastroLoginPage = new CadastroUsuarioLoginPage()

// Frontend: validações de fluxo de produtos via UI para usuário admin.
// Cobre cadastro, tentativa de duplicidade, atualização e exclusão.
describe('Frontend - Validação de Cadastro, Atualização e Exclusão de Produtos como Admin', () => {
    let produtoFixture
    let produtoParaAtualizar

    // Carrega fixture de produtos antes da suite
    before(() => {
        cy.fixture('produtos').then((produtos) => {
            produtoFixture = produtos
        })
    })

    // Faz login como admin antes de cada teste para garantir estado consistente
    beforeEach(() => {
        cy.fixture('usuarios').then((user) => {
            loginPage.visitar()
            loginPage.preencherEmail(user.loginValido.email)
            loginPage.preencherSenha(user.loginValido.senha)
            loginPage.clicarEntrar()
            loginPage.validarLoginComSucesso()
        })
    })

    // Cadastro via UI: submete o formulário e valida resposta interceptada (201)
    it('Deve cadastrar um novo produto com sucesso', () => {
        produtoParaAtualizar = {
            nome: produtoFixture.produtoValido.nome,
            preco: produtoFixture.produtoValido.preco,
            descricao: produtoFixture.produtoValido.descricao,
            quantidade: produtoFixture.produtoValido.quantidade,
            imagem: 'produto.png'
        }
        cadastroProdutoPage.acessarPaginaDeCadastro()
        cadastroProdutoPage.preencherFormulario(produtoParaAtualizar)
        cadastroProdutoPage.submeterFormulario()
    })

    // Validação de duplicidade via UI: tentar cadastrar o mesmo nome deve resultar em 400
    it('Não deve permitir cadastrar produto com nome já existente', () => {
        cadastroProdutoPage.acessarPaginaDeCadastro()
        cadastroProdutoPage.preencherFormulario(produtoParaAtualizar)
        cy.intercept('POST', '**/produtos').as('cadastrarProduto')
        cy.get('[data-testid=cadastarProdutos]').click()
        cy.wait('@cadastrarProduto').then((intercept) => {
            expect(intercept.response.statusCode).to.eq(400)
            expect(intercept.response.body.message).to.eq('Já existe produto com esse nome')
        })
    })

    // Exclusão via UI: remove o produto e valida que ele não aparece mais na lista
    it('Deve excluir o produto cadastrado', () => {
        produtosPage.visitar()
        produtosPage.validarTabelaProdutosVisivel()
        produtosPage.deletarProduto(produtoFixture.produtoValido.nome)
    })
})


// Tests for non-admin users: register via public form and ensure no admin access
describe('Frontend - Acesso a Produtos por Usuário Não-Admin (UI pública)', () => {
    it('Usuário não-admin não deve acessar página de cadastro de produtos (admin)', () => {
        const unique = Date.now()
        const nome = `NA Usuario ${unique}`
        const email = `na_${unique}@test.com`
        const senha = 'Senha123!'

        // Registrar via fluxo público
        cadastroLoginPage.visitar()
        cadastroLoginPage.preencherNome(nome)
        cadastroLoginPage.preencherEmail(email)
        cadastroLoginPage.preencherSenha(senha)
        cadastroLoginPage.clicarCadastrar()
        cadastroLoginPage.validarCadastroComSucesso()

        // Logar com o usuário criado
        loginPage.visitar()
        loginPage.preencherEmail(email)
        loginPage.preencherSenha(senha)
        loginPage.clicarEntrar()
        // Intercepta requisições de produtos que a página admin costuma carregar
        cy.intercept('GET', '**/**produtos').as('produtosRequest')

        // Tenta acessar a rota de cadastro de produtos do admin
        cy.visit(Cypress.env('frontendUrl') + '/admin/cadastrarprodutos')
        cy.get('body').should('be.visible')

        // Se a página fez a requisição de produtos, validamos que a API bloqueou (401/403)
        cy.wait('@produtosRequest', { timeout: 5000 }).then((intercept) => {
            const status = intercept.response && intercept.response.statusCode
            // Esperamos código de não autorizado/forbidden. Se a API retornar 200, consideramos isso um bug.
            if (status === 200) {
                throw new Error(`BUG: API permitiu acesso à rota de produtos para usuário não-admin (status ${status})`)
            }
            expect([401, 403]).to.include(status)
        })

        // O botão de cadastrar produtos não deve existir para não-admin
        cy.get('[data-testid=cadastarProdutos]').should('not.exist')
    })

    it('Usuário não-admin não deve ver lista admin de produtos', () => {
        const unique = Date.now() + 1
        const email = `na_${unique}@test.com`
        const senha = 'Senha123!'

        cadastroLoginPage.visitar()
        cadastroLoginPage.preencherNome(`NA Usuario ${unique}`)
        cadastroLoginPage.preencherEmail(email)
        cadastroLoginPage.preencherSenha(senha)
        cadastroLoginPage.clicarCadastrar()
        cadastroLoginPage.validarCadastroComSucesso()

        loginPage.visitar()
        loginPage.preencherEmail(email)
        loginPage.preencherSenha(senha)
        loginPage.clicarEntrar()

        // Intercepta a listagem de produtos que a rota admin costuma disparar
        cy.intercept('GET', '**/produtos**').as('listarProdutosRequest')

        // Tenta acessar listagem admin
        cy.visit(Cypress.env('frontendUrl') + '/admin/listarprodutos')

        // Aguarda a página carregar rapidamente
        cy.get('body').should('be.visible')

        // Valida que a requisição de listagem foi bloqueada (401/403) ou falha explicitamente se permitir 200
        cy.wait('@listarProdutosRequest', { timeout: 5000 }).then((intercept) => {
            const status = intercept.response && intercept.response.statusCode
            if (status === 200) {
                throw new Error(`BUG: API permitiu listagem de produtos para usuário não-admin (status ${status})`)
            }
            expect([401, 403]).to.include(status)
        })

        // O usuário não-admin não deve ver controles administrativos dentro da tabela de produtos
        cy.get('table tbody').then(($tbody) => {
            if ($tbody.length) {
                cy.wrap($tbody).within(() => {
                    cy.contains('button', 'Editar').should('not.exist')
                    cy.contains('button', 'Excluir').should('not.exist')
                })
            } else {
                cy.contains('button', 'Editar').should('not.exist')
                cy.contains('button', 'Excluir').should('not.exist')
            }
        })
        cy.get('[data-testid=cadastarProdutos]').should('not.exist')
    })
})