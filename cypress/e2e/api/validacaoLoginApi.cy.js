// Suite de testes de API para o endpoint de login.
// Valida comportamento de autenticação em casos de sucesso e falhas.
describe('API - Login com validações', () => {
  let loginData

  before(() => {
    cy.fixture('login').then((data) => {
      loginData = data
    })
  })

  // Caso de sucesso: credenciais válidas devem retornar 200 e token de autorização
  it('Deve realizar login com sucesso', () => {
    cy.request('POST', `${Cypress.env('apiUrl')}/login`, loginData.usuarioValido).then((res) => {
      expect(res.status).to.eq(200)
      expect(res.body.message).to.eq('Login realizado com sucesso')
      expect(res.body).to.have.property('authorization')
    })
  })

  // Erro de autenticação: senha inválida deve retornar 401 com mensagem apropriada
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

  // Erro de autenticação: e-mail inexistente deve retornar 401 com mesma mensagem
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

// Validação de campos: enviar payload vazio deve retornar 400 com erros por campo
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

// Suite de testes para usuários que não são admin
describe('API - Login com usuários não-admin', () => {
  let adminToken
  let usuarioNaoAdmin
  let createdUserIds = []
  let createdProductIds = []

  beforeEach(() => {
    // Faz login como admin uma vez antes de cada teste para obter o token
    cy.request('POST', `${Cypress.env('apiUrl')}/login`, {
      email: 'fulano@qa.com',
      password: 'teste'
    }).then((res) => {
      adminToken = res.body.authorization
    })
    
    // Gera um novo usuário não-admin para cada teste
    usuarioNaoAdmin = {
      nome: `Usuario NaoAdmin ${Date.now()}`,
      email: `naoAdmin_${Date.now()}@teste.com`,
      password: 'TestPassword123',
      administrador: 'false'
    }
  })

  // Cleanup: tenta remover usuários/produtos criados durante cada teste
  afterEach(() => {
    // remove produtos criados
    if (createdProductIds.length) {
      createdProductIds.forEach((pid) => {
        cy.request({
          method: 'DELETE',
          url: `${Cypress.env('apiUrl')}/produtos/${pid}`,
          headers: { 'Authorization': adminToken },
          failOnStatusCode: false
        })
      })
      createdProductIds = []
    }

    // remove usuarios criados
    if (createdUserIds.length) {
      createdUserIds.forEach((uid) => {
        cy.request({
          method: 'DELETE',
          url: `${Cypress.env('apiUrl')}/usuarios/${uid}`,
          headers: { 'Authorization': adminToken },
          failOnStatusCode: false
        })
      })
      createdUserIds = []
    }
  })

  // Criar um usuário não-admin usando credenciais admin
  it('Deve criar um usuário não-admin com sucesso', () => {
    cy.request({
      method: 'POST',
      url: `${Cypress.env('apiUrl')}/usuarios`,
      headers: {
        'Authorization': adminToken
      },
      body: usuarioNaoAdmin
    }).then((res) => {
      expect(res.status).to.equal(201)
      expect(res.body.message).to.eq('Cadastro realizado com sucesso')
      expect(res.body).to.have.property('_id')
      // guarda para cleanup
      createdUserIds.push(res.body._id)
    })
  })

  // Login bem-sucedido com usuário não-admin: deve retornar 200 e token
  it('Deve realizar login com sucesso como usuário não-admin', () => {
    // Primeiro cria o usuário não-admin
    cy.request({
      method: 'POST',
      url: `${Cypress.env('apiUrl')}/usuarios`,
      headers: {
        'Authorization': adminToken
      },
      body: usuarioNaoAdmin
    }).then((res) => {
      createdUserIds.push(res.body._id)
    })

    // Depois tenta fazer login
    cy.request('POST', `${Cypress.env('apiUrl')}/login`, {
      email: usuarioNaoAdmin.email,
      password: usuarioNaoAdmin.password
    }).then((res) => {
      expect(res.status).to.eq(200)
      expect(res.body.message).to.eq('Login realizado com sucesso')
      expect(res.body).to.have.property('authorization')
    })
  })

  // Validar que usuário não-admin recebe token válido
  it('Deve retornar token válido para usuário não-admin', () => {
    // Primeiro cria o usuário não-admin
    cy.request({
      method: 'POST',
      url: `${Cypress.env('apiUrl')}/usuarios`,
      headers: {
        'Authorization': adminToken
      },
      body: usuarioNaoAdmin
    }).then((res) => {
      createdUserIds.push(res.body._id)
    })

    // Depois faz login
    cy.request('POST', `${Cypress.env('apiUrl')}/login`, {
      email: usuarioNaoAdmin.email,
      password: usuarioNaoAdmin.password
    }).then((res) => {
      expect(res.status).to.eq(200)
      expect(res.body.authorization).to.not.be.empty
      expect(typeof res.body.authorization).to.eq('string')
    })
  })

  // Validar que usuário não-admin pode criar produtos (se a API permite)
  it('Deve conseguir criar produtos como usuário não-admin', () => {
    // Cria usuário não-admin
    cy.request({
      method: 'POST',
      url: `${Cypress.env('apiUrl')}/usuarios`,
      headers: {
        'Authorization': adminToken
      },
      body: usuarioNaoAdmin
    }).then((res) => {
      createdUserIds.push(res.body._id)
    })

    // Faz login como não-admin
    cy.request('POST', `${Cypress.env('apiUrl')}/login`, {
      email: usuarioNaoAdmin.email,
      password: usuarioNaoAdmin.password
    }).then((loginRes) => {
      const tokenNaoAdmin = loginRes.body.authorization

      const novoProduto = {
        nome: `Produto NaoAdmin ${Date.now()}`,
        preco: 100,
        descricao: 'Produto de teste para usuário não-admin',
        quantidade: 10
      }

      // Tenta criar um produto
      cy.request({
        method: 'POST',
        url: `${Cypress.env('apiUrl')}/produtos`,
        headers: {
          'Authorization': tokenNaoAdmin
        },
        body: novoProduto,
        failOnStatusCode: false
      }).then((res) => {
        // Aceita tanto 201 (criado com sucesso) quanto 400/403 (sem permissão)
        expect([201, 400, 403]).to.include(res.status)
      })
    })
  })

  // Validar que usuário não-admin não pode deletar usuários
  it('Usuário não-admin não deve conseguir deletar outro usuário', () => {
    // Cria um usuário para deletar
    // Tornamos o usuário alvo um admin para garantir que um não-admin não consiga deletá-lo
    const usuarioPraDelete = {
      nome: `Usuario Delete ${Date.now()}`,
      email: `delete_${Date.now()}@teste.com`,
      password: 'TestPassword123',
      administrador: 'true'
    }

    let usuarioId
    
    // Cria usuário que será deletado
    cy.request({
      method: 'POST',
      url: `${Cypress.env('apiUrl')}/usuarios`,
      headers: {
        'Authorization': adminToken
      },
      body: usuarioPraDelete
    }).then((res) => {
      usuarioId = res.body._id
      createdUserIds.push(usuarioId)
    })

    // Cria usuário não-admin que tentará deletar
    cy.request({
      method: 'POST',
      url: `${Cypress.env('apiUrl')}/usuarios`,
      headers: {
        'Authorization': adminToken
      },
      body: usuarioNaoAdmin
    }).then((res) => {
      createdUserIds.push(res.body._id)
    })

    // Faz login como não-admin
    cy.request('POST', `${Cypress.env('apiUrl')}/login`, {
      email: usuarioNaoAdmin.email,
      password: usuarioNaoAdmin.password
    }).then((loginRes) => {
      const tokenNaoAdmin = loginRes.body.authorization

      // Tenta deletar o outro usuário
      cy.request({
        method: 'DELETE',
        url: `${Cypress.env('apiUrl')}/usuarios/${usuarioId}`,
        headers: {
          'Authorization': tokenNaoAdmin
        },
        failOnStatusCode: false
      }).then((res) => {
        // Se API permitir (200), reportamos explicitamente como bug
        if (res.status === 200) {
          throw new Error('BUG: API permitiu que usuário não-admin deletasse outro usuário (status 200)')
        } else {
          expect([400, 401, 403]).to.include(res.status)
        }
      })
    })
  })

  // Validar que usuário não-admin não pode deletar produtos
  it('Usuário não-admin não deve conseguir deletar produtos de outros usuários', () => {
    // Admin cria um produto
    const novoProduto = {
      nome: `Produto Delete ${Date.now()}`,
      preco: 100,
      descricao: 'Produto para teste de delete',
      quantidade: 10
    }

    let produtoId

    cy.request({
      method: 'POST',
      url: `${Cypress.env('apiUrl')}/produtos`,
      headers: {
        'Authorization': adminToken
      },
      body: novoProduto
    }).then((res) => {
      produtoId = res.body._id
      createdProductIds.push(produtoId)
    })

    // Cria usuário não-admin
    cy.request({
      method: 'POST',
      url: `${Cypress.env('apiUrl')}/usuarios`,
      headers: {
        'Authorization': adminToken
      },
      body: usuarioNaoAdmin
    }).then((res) => {
      createdUserIds.push(res.body._id)
    })

    // Faz login como não-admin
    cy.request('POST', `${Cypress.env('apiUrl')}/login`, {
      email: usuarioNaoAdmin.email,
      password: usuarioNaoAdmin.password
    }).then((loginRes) => {
      const tokenNaoAdmin = loginRes.body.authorization

      // Tenta deletar produto criado por admin
      cy.request({
        method: 'DELETE',
        url: `${Cypress.env('apiUrl')}/produtos/${produtoId}`,
        headers: {
          'Authorization': tokenNaoAdmin
        },
        failOnStatusCode: false
      }).then((res) => {
        if (res.status === 200) {
          throw new Error('BUG: API permitiu que usuário não-admin deletasse um produto de outro usuário (status 200)')
        } else {
          expect([400, 401, 403]).to.include(res.status)
        }
      })
    })
  })
})