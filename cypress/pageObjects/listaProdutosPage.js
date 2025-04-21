export class ListaProdutosPage {
  visitar() {
    // Intercepta a requisição de listagem de produtos
    cy.intercept('GET', '**/produtos').as('listarProdutos')

    cy.visit(Cypress.env('frontendUrl') + '/admin/listarprodutos')

    // Aguarda a resposta da API de produtos
    cy.wait('@listarProdutos').its('response.statusCode').should('eq', 200)
  }

  validarTabelaProdutosVisivel() {
    cy.get('table').should('be.visible')
  }

  validarProdutoNaLista(nomeProduto) {
    // Atualiza a página para garantir renderização
    cy.reload()

    // Valida que o produto aparece na tabela
    cy.contains('td', nomeProduto).parents('tr').as('linhaProduto')
  }

  buscarProdutoPorNome(nomeProduto) {
    return cy.contains('td', nomeProduto).parents('tr').as('linhaProduto')
  }

  deletarProduto(nomeProduto) {
    // Intercepta a requisição de exclusão
    cy.intercept('DELETE', '**/produtos/**').as('deletarProduto')

    this.buscarProdutoPorNome(nomeProduto)

    // Clica no botão Excluir dentro da linha
    cy.get('@linhaProduto').within(() => {
      cy.contains('Excluir').click()
    })

    // Aguarda a requisição de exclusão
    cy.wait('@deletarProduto').its('response.statusCode').should('eq', 200)

    // Atualiza a página para garantir renderização
    cy.reload()

    // Valida que o produto sumiu da lista
    cy.contains('td', nomeProduto).should('not.exist')
  }
}