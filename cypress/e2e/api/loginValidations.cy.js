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

it('Não deve logar com campos vazios', () => {
  cy.request({
    method: 'POST',
    url: `${Cypress.env('apiUrl')}/login`,
    failOnStatusCode: false,
    body: {}
  }).then((res) => {
  expect(res.status).to.eq(400)
  // API returns validation errors per-field (email/password) rather than a single message
  expect(res.body).to.have.property('email')
  expect(res.body.email).to.eq('email é obrigatório')
  expect(res.body).to.have.property('password')
  expect(res.body.password).to.eq('password é obrigatório')
  })
})