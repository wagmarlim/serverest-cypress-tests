describe('API - Login com validações', () => {
  let loginData

  before(() => {
    cy.fixture('login').then((data) => {
      loginData = data
    })
  })

  it('Deve realizar login com sucesso', () => {
    cy.request('POST', `${Cypress.env('apiUrl')}/login`, loginData.usuarioValido).then((res) => {
      expect(res.status).to.eq(200)
      expect(res.body.message).to.eq('Login realizado com sucesso')
      expect(res.body).to.have.property('authorization')
    })
  })

  it('Não deve logar com senha inválida', () => {
    cy.request({
      method: 'POST',
      url: `${Cypress.env('apiUrl')}/login`,
      failOnStatusCode: false,
      body: loginData.senhaInvalida
    }).then((res) => {
      expect(res.status).to.eq(401)
      expect(res.body.message).to.eq('Email e/ou senha inválidos')
    })
  })

  it('Não deve logar com e-mail inexistente', () => {
    cy.request({
      method: 'POST',
      url: `${Cypress.env('apiUrl')}/login`,
      failOnStatusCode: false,
      body: loginData.emailInvalido
    }).then((res) => {
      expect(res.status).to.eq(401)
      expect(res.body.message).to.eq('Email e/ou senha inválidos')
    })
  })
})