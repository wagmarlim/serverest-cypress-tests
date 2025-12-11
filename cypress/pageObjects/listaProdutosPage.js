// Page Object para a página de listagem de produtos.
// Fornece métodos para visitar, buscar, validar e deletar produtos na UI.
export class ListaProdutosPage {
  // Visita a rota de listagem e aguarda a resposta da API de produtos
  visitar() {
    // Intercepta a requisição de listagem de produtos
    cy.intercept('GET', '**/produtos').as('listarProdutos')

    cy.visit(Cypress.env('frontendUrl') + '/admin/listarprodutos')

    // Aguarda a resposta da API de produtos
    cy.wait('@listarProdutos').its('response.statusCode').should('eq', 200)
  }

  // Valida que a tabela de produtos está visível na página
  validarTabelaProdutosVisivel() {
    cy.get('table').should('be.visible')
  }

  // Carrega todos os elementos da tabela fazendo scroll até o final
  carregarTodosOsElementos() {
    cy.get('table tbody').then(($table) => {
      // Faz scroll até o final para carregar todos os elementos (lazy loading)
      cy.get('table tbody tr:last').scrollIntoView()
      cy.wait(200) // Aguarda carregamento dos elementos
    })
    
    // Volta ao topo da tabela
    cy.get('table tbody tr:first').scrollIntoView()
  }

  // Garante que um produto com o nome informado existe na tabela
  // e salva a linha correspondente como `@linhaProduto` para ações posteriores
  validarProdutoNaLista(nomeProduto) {
    // Atualiza a página para garantir renderização
    cy.reload()

    // Valida que o produto aparece na tabela
    cy.contains('td', nomeProduto).parents('tr').as('linhaProduto')
  }

  // Busca um produto pelo nome na tabela sem scroll desnecessário
  buscarProdutoPorNome(nomeProduto) {
    // Primeiro, carrega todos os elementos
    this.carregarTodosOsElementos()
    
    // Usa filter para encontrar a linha que contém o produto sem fazer scroll
    return cy.get('table tbody tr').filter((index, element) => {
      return Cypress.$(element).text().includes(nomeProduto)
    }).first().as('linhaProduto')
  }

  // Exclui o produto encontrado pelo nome. Intercepta e valida a requisição DELETE.
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