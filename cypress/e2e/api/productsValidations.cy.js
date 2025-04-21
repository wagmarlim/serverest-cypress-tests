describe('API - Validação de Cadastro, Atualização e Exclusão de Produtos como Admin', () => {
  let token
  let productId
  let produtoFixture

  before(() => {
    cy.fixture('produtos').then((produtos) => {
      produtoFixture = produtos
    })

    cy.fixture('usuarios').then((u) => {
      cy.request('POST', `${Cypress.env('apiUrl')}/login`, {
        email: u.loginValido.email,
        password: u.loginValido.senha
      }).then((res) => {
        token = res.body.authorization
      })
    })
  })

  it('Deve cadastrar um novo produto', () => {
    cy.request({
      method: 'POST',
      url: `${Cypress.env('apiUrl')}/produtos`,
      headers: { Authorization: token },
      body: produtoFixture.produtoValido
    }).then((res) => {
      expect(res.status).to.eq(201)
      productId = res.body._id
    })
  })

  it('Não deve permitir cadastrar produto com nome já existente', () => {

    // Tenta cadastrar o mesmo produto novamente
    cy.request({
      method: 'POST',
      url: `${Cypress.env('apiUrl')}/produtos`,
      headers: { Authorization: token },
      body: produtoFixture.produtoValido,
      failOnStatusCode: false // evita falha automática no status 400
    }).then((res) => {
      expect(res.status).to.eq(400)
      expect(res.body.message).to.eq('Já existe produto com esse nome')
    })
  })

  it('Deve atualizar o produto cadastrado anteriormente', () => {
    cy.request({
      method: 'PUT',
      url: `${Cypress.env('apiUrl')}/produtos/${productId}`,
      headers: { Authorization: token },
      body: produtoFixture.produtoAtualizado
    }).then((res) => {
      expect(res.status).to.eq(200)
      expect(res.body.message).to.eq('Registro alterado com sucesso')
    })
  })

  it('Deve excluir o produto cadastrado anteriormente', () => {
    cy.request({
      method: 'DELETE',
      url: `${Cypress.env('apiUrl')}/produtos/${productId}`,
      headers: { Authorization: token }
    }).then((res) => {
      expect(res.status).to.eq(200)
      expect(res.body.message).to.eq('Registro excluído com sucesso')
    })
  })
})
