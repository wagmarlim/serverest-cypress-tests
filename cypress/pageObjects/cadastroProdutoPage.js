// Page Object para a página de cadastro de produtos.
// Encapsula navegação, preenchimento e submissão do formulário de produto.
export class CadastroProdutoPage {
    // Navega para a rota de cadastro de produtos (url hardcoded conforme app)
    acessarPaginaDeCadastro() {
        cy.visit('https://front.serverest.dev/admin/cadastrarprodutos')
    }

    // Preenche o formulário com os dados do objeto `produto`.
    // O campo de arquivo é opcional e só é anexado se `produto.imagem` existir.
    preencherFormulario(produto) {
        cy.get('[data-testid=nome]').type(produto.nome)
        cy.get('[data-testid=preco]').type(produto.preco)
        cy.get('[data-testid=descricao]').type(produto.descricao)
        cy.get('[data-testid=quantity]').type(produto.quantidade)
        if (produto.imagem) {
            cy.get('input[type="file"]').attachFile(produto.imagem)
        }
    }

    // Submete o formulário e aguarda/intercepta a requisição de criação.
    // Valida o status e a mensagem retornada pela API ao concluir.
    submeterFormulario() {
        // Intercepta a requisição POST de cadastro de produto
        cy.intercept('POST', '**/produtos').as('cadastrarProduto')

        // Clica no botão de cadastrar
        cy.get('[data-testid=cadastarProdutos]').click()

        // Aguarda a requisição terminar e valida a resposta
        cy.wait('@cadastrarProduto').then((intercept) => {
            expect(intercept.response.statusCode).to.eq(201)
            expect(intercept.response.body).to.have.property('message', 'Cadastro realizado com sucesso')
        })
    }
}

