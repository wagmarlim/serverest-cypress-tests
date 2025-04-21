export class CadastroProdutoPage {
    acessarPaginaDeCadastro() {
        cy.visit('https://front.serverest.dev/admin/cadastrarprodutos')
    }

    preencherFormulario(produto) {
        cy.get('[data-testid=nome]').type(produto.nome)
        cy.get('[data-testid=preco]').type(produto.preco)
        cy.get('[data-testid=descricao]').type(produto.descricao)
        cy.get('[data-testid=quantity]').type(produto.quantidade)
        if (produto.imagem) {
            cy.get('input[type="file"]').attachFile(produto.imagem)
        }
    }

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

