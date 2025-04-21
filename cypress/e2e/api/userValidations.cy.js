

describe('API - Usuários', () => {
  let userId
  const userData = {
    nome: 'Usuário API',
    email: `usuario_${Date.now()}@teste.com`,
    password: 'teste123',
    administrador: 'true'
  }

  it('Deve cadastrar um novo usuário', () => {
    cy.request('POST', `${Cypress.env('apiUrl')}/usuarios`, userData).then((res) => {
      expect(res.status).to.eq(201)
      expect(res.body.message).to.eq('Cadastro realizado com sucesso')
      userId = res.body._id
    })
  })

  it('Deve validar erro ao cadastrar usuário já existente', () => {
    cy.request({
      method: 'POST',
      url: `${Cypress.env('apiUrl')}/usuarios`,
      body: userData,
      failOnStatusCode: false
    }).then((res) => {
      expect(res.status).to.eq(400)
      expect(res.body.message).to.eq('Este email já está sendo usado')
    })
  })

  it('Deve listar os usuários cadastrados e encontrar o usuário criado', () => {
    cy.request('GET', `${Cypress.env('apiUrl')}/usuarios`).then((res) => {
      expect(res.status).to.eq(200)
      expect(res.body).to.have.property('usuarios')
      const usuarioEncontrado = res.body.usuarios.find(u =>
        u._id === userId && u.email === userData.email
      )
      expect(usuarioEncontrado).to.exist
      expect(usuarioEncontrado.nome).to.eq(userData.nome)
      expect(usuarioEncontrado.email).to.eq(userData.email)
    })
  })

  it('Deve deletar o usuário criado', () => {
    cy.request('DELETE', `${Cypress.env('apiUrl')}/usuarios/${userId}`).then((res) => {
      expect(res.status).to.eq(200)
      expect(res.body.message).to.eq('Registro excluído com sucesso')
    })
  })
})