// Testes de API: validações de operações em `usuarios` realizadas por usuários não-admin
describe('API - Usuários com usuário não-admin', () => {
  let adminToken
  let usuarioNaoAdmin
  let createdUserIds = []

  const tryLogin = (body) => {
    return cy.request({
      method: 'POST',
      url: `${Cypress.env('apiUrl')}/login`,
      body,
      failOnStatusCode: false
    })
  }

  beforeEach(() => {
    // tenta autenticar admin via env -> fixtures
    const envEmail = Cypress.env('adminEmail')
    const envPassword = Cypress.env('adminPassword')

    if (envEmail && envPassword) {
      tryLogin({ email: envEmail, password: envPassword }).then((res) => {
        if (res.status === 200 && res.body.authorization) {
          adminToken = res.body.authorization
        }
      })
    }

    cy.fixture('login').then((loginF) => {
      tryLogin(loginF.usuarioValido).then((res) => {
        if (res.status === 200 && res.body.authorization) {
          adminToken = res.body.authorization
          return
        }

        cy.fixture('usuarios').then((u) => {
          tryLogin({ email: u.loginValido.email, password: u.loginValido.senha }).then((res2) => {
            if (res2.status === 200 && res2.body.authorization) {
              adminToken = res2.body.authorization
            } else {
              throw new Error('Falha ao autenticar admin. Configure credenciais via Cypress.env ou atualize fixtures.')
            }
          })
        })
      })
    })

    // Gera um usuário não-admin dinâmico para os testes
    usuarioNaoAdmin = {
      nome: `NaoAdmin ${Date.now()}`,
      email: `naoadmin_${Date.now()}@teste.com`,
      password: 'Senha1234',
      administrador: 'false'
    }
  })

  afterEach(() => {
    // cleanup de usuários criados (usando token admin)
    if (createdUserIds.length && adminToken) {
      createdUserIds.forEach((uid) => {
        cy.request({ method: 'DELETE', url: `${Cypress.env('apiUrl')}/usuarios/${uid}`, headers: { Authorization: adminToken }, failOnStatusCode: false })
      })
      createdUserIds = []
    }
  })

  it('Deve permitir login para usuário não-admin (criado pelo admin)', () => {
    // cria usuário não-admin via admin
    cy.request({ method: 'POST', url: `${Cypress.env('apiUrl')}/usuarios`, headers: { Authorization: adminToken }, body: usuarioNaoAdmin }).then((res) => {
      expect(res.status).to.be.oneOf([201, 200])
      const id = res.body._id
      if (id) createdUserIds.push(id)

      // login do usuário criado
      cy.request({ method: 'POST', url: `${Cypress.env('apiUrl')}/login`, body: { email: usuarioNaoAdmin.email, password: usuarioNaoAdmin.password } }).then((loginRes) => {
        expect(loginRes.status).to.eq(200)
        expect(loginRes.body).to.have.property('authorization')
      })
    })
  })

  it('Usuário não-admin não deve conseguir listar usuários', () => {
    // cria usuario nao-admin
    cy.request({ method: 'POST', url: `${Cypress.env('apiUrl')}/usuarios`, headers: { Authorization: adminToken }, body: usuarioNaoAdmin }).then((res) => {
      createdUserIds.push(res.body._id)

      // login não-admin
      cy.request({ method: 'POST', url: `${Cypress.env('apiUrl')}/login`, body: { email: usuarioNaoAdmin.email, password: usuarioNaoAdmin.password } }).then((loginRes) => {
        const tokenNaoAdmin = loginRes.body.authorization

        cy.request({ method: 'GET', url: `${Cypress.env('apiUrl')}/usuarios`, headers: { Authorization: tokenNaoAdmin }, failOnStatusCode: false }).then((res) => {
          if (res.status === 200) {
            throw new Error('BUG: API permitiu que usuário não-admin listasse usuários (status 200)')
          } else {
            expect([401, 403]).to.include(res.status)
          }
        })
      })
    })
  })

  it('Usuário não-admin não deve conseguir atualizar outro usuário', () => {
    // cria usuário alvo (admin)
    const alvo = { nome: `Alvo ${Date.now()}`, email: `alvo_${Date.now()}@teste.com`, password: 'Senha1234', administrador: 'true' }
    let alvoId

    cy.request({ method: 'POST', url: `${Cypress.env('apiUrl')}/usuarios`, headers: { Authorization: adminToken }, body: alvo }).then((res) => {
      alvoId = res.body._id
      createdUserIds.push(alvoId)

      // cria e loga usuário não-admin
      cy.request({ method: 'POST', url: `${Cypress.env('apiUrl')}/usuarios`, headers: { Authorization: adminToken }, body: usuarioNaoAdmin }).then((r2) => {
        createdUserIds.push(r2.body._id)

        cy.request({ method: 'POST', url: `${Cypress.env('apiUrl')}/login`, body: { email: usuarioNaoAdmin.email, password: usuarioNaoAdmin.password } }).then((loginRes) => {
          const tokenNaoAdmin = loginRes.body.authorization

          const atualizado = { nome: 'Alterado Por NaoAdmin' }
          cy.request({ method: 'PUT', url: `${Cypress.env('apiUrl')}/usuarios/${alvoId}`, headers: { Authorization: tokenNaoAdmin }, body: atualizado, failOnStatusCode: false }).then((res) => {
            if (res.status === 200) {
              throw new Error('BUG: API permitiu que usuário não-admin atualizasse outro usuário (status 200)')
            } else {
              expect([400, 401, 403]).to.include(res.status)
            }
          })
        })
      })
    })
  })

  it('Usuário não-admin não deve conseguir deletar outro usuário', () => {
    // cria usuário alvo
    const alvo = { nome: `AlvoDel ${Date.now()}`, email: `alvodel_${Date.now()}@teste.com`, password: 'Senha1234', administrador: 'true' }
    let alvoId

    cy.request({ method: 'POST', url: `${Cypress.env('apiUrl')}/usuarios`, headers: { Authorization: adminToken }, body: alvo }).then((res) => {
      alvoId = res.body._id
      createdUserIds.push(alvoId)

      // cria e loga usuário não-admin
      cy.request({ method: 'POST', url: `${Cypress.env('apiUrl')}/usuarios`, headers: { Authorization: adminToken }, body: usuarioNaoAdmin }).then((r2) => {
        createdUserIds.push(r2.body._id)

        cy.request({ method: 'POST', url: `${Cypress.env('apiUrl')}/login`, body: { email: usuarioNaoAdmin.email, password: usuarioNaoAdmin.password } }).then((loginRes) => {
          const tokenNaoAdmin = loginRes.body.authorization

          cy.request({ method: 'DELETE', url: `${Cypress.env('apiUrl')}/usuarios/${alvoId}`, headers: { Authorization: tokenNaoAdmin }, failOnStatusCode: false }).then((res) => {
            if (res.status === 200) {
              throw new Error('BUG: API permitiu que usuário não-admin deletasse outro usuário (status 200)')
            } else {
              expect([400, 401, 403]).to.include(res.status)
            }
          })
        })
      })
    })
  })
})


// Suite de testes de API para CRUD de usuários.
// Cobre criação, erro de duplicidade, listagem, atualização e exclusão.
describe('API - Usuários', () => {
  let userId
  const userData = {
    nome: 'Usuário API',
    email: `usuario_${Date.now()}@teste.com`,
    password: 'teste123',
    administrador: 'true'
  }

  // Cria um usuário via API e guarda o id para os próximos passos
  it('Deve cadastrar um novo usuário', () => {
    cy.request('POST', `${Cypress.env('apiUrl')}/usuarios`, userData).then((res) => {
      expect(res.status).to.eq(201)
      expect(res.body.message).to.eq('Cadastro realizado com sucesso')
      userId = res.body._id
    })
  })

  // Tenta cadastrar novamente o mesmo usuário e valida erro de duplicidade (400)
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

  // Recupera a lista de usuários e verifica que o usuário criado está presente
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

  // Atualiza o usuário criado anteriormente e valida resposta de sucesso (200)
  it('Deve atualizar o usuário criado anteriormente', () => {
    const usuarioAtualizado = {
      nome: 'Usuário API Atualizado',
      email: userData.email,
      password: 'novaSenha123',
      administrador: 'true'
    }

    cy.request({
      method: 'PUT',
      url: `${Cypress.env('apiUrl')}/usuarios/${userId}`,
      body: usuarioAtualizado
    }).then((res) => {
      expect(res.status).to.eq(200)
      expect(res.body.message).to.eq('Registro alterado com sucesso')
    })
  })

  // Remove o usuário criado e valida mensagem de exclusão bem-sucedida
  it('Deve deletar o usuário criado', () => {
    cy.request('DELETE', `${Cypress.env('apiUrl')}/usuarios/${userId}`).then((res) => {
      expect(res.status).to.eq(200)
      expect(res.body.message).to.eq('Registro excluído com sucesso')
    })
  })
})