// Testes de API: validações de operações em `produtos` realizadas por usuários não-admin
describe('API - Produtos com usuário não-admin', () => {
  let adminToken
  let usuarioNaoAdmin
  let createdUserIds = []
  let createdProductIds = []

  const tryLogin = (body) => {
    return cy.request({
      method: 'POST',
      url: `${Cypress.env('apiUrl')}/login`,
      body,
      failOnStatusCode: false
    })
  }

  // Obtém token admin: tenta env => fixtures.login => fixtures.usuarios
  beforeEach(() => {
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
              throw new Error('Falha ao autenticar admin. Forneça credenciais via Cypress.env ou atualize fixtures.')
            }
          })
        })
      })
    })

    // Gera um usuário não-admin para usar nos testes
    usuarioNaoAdmin = {
      nome: `NaoAdmin ${Date.now()}`,
      email: `naoadmin_${Date.now()}@teste.com`,
      password: 'Senha1234',
      administrador: 'false'
    }
  })

  // Cleanup: remove produtos e usuários criados com token admin
  afterEach(() => {
    if (createdProductIds.length && adminToken) {
      createdProductIds.forEach((pid) => {
        cy.request({ method: 'DELETE', url: `${Cypress.env('apiUrl')}/produtos/${pid}`, headers: { Authorization: adminToken }, failOnStatusCode: false })
      })
      createdProductIds = []
    }

    if (createdUserIds.length && adminToken) {
      createdUserIds.forEach((uid) => {
        cy.request({ method: 'DELETE', url: `${Cypress.env('apiUrl')}/usuarios/${uid}`, headers: { Authorization: adminToken }, failOnStatusCode: false })
      })
      createdUserIds = []
    }
  })

  it('Usuário não-admin não deve conseguir criar produto', () => {
    // cria usuário não-admin via admin
    cy.request({ method: 'POST', url: `${Cypress.env('apiUrl')}/usuarios`, headers: { Authorization: adminToken }, body: usuarioNaoAdmin }).then((res) => {
      createdUserIds.push(res.body._id)
    })

    // login não-admin
    cy.request({ method: 'POST', url: `${Cypress.env('apiUrl')}/login`, body: { email: usuarioNaoAdmin.email, password: usuarioNaoAdmin.password } }).then((loginRes) => {
      const tokenNaoAdmin = loginRes.body.authorization

      const novoProduto = { nome: `ProdutoNaoAdmin ${Date.now()}`, preco: 10, descricao: 'Teste', quantidade: 1 }

      cy.request({ method: 'POST', url: `${Cypress.env('apiUrl')}/produtos`, headers: { Authorization: tokenNaoAdmin }, body: novoProduto, failOnStatusCode: false }).then((res) => {
        if (res.status === 201) {
          // API permitiu criação — reportar como bug
          createdProductIds.push(res.body._id)
          throw new Error('BUG: API permitiu que usuário não-admin criasse produto (status 201)')
        } else {
          expect([400, 401, 403]).to.include(res.status)
        }
      })
    })
  })

  it('Usuário não-admin não deve conseguir atualizar produto de outro', () => {
    // admin cria produto
    const produto = { nome: `ProdutoAdmin ${Date.now()}`, preco: 50, descricao: 'Produto admin', quantidade: 5 }
    let produtoId

    cy.request({ method: 'POST', url: `${Cypress.env('apiUrl')}/produtos`, headers: { Authorization: adminToken }, body: produto }).then((res) => {
      produtoId = res.body._id
      createdProductIds.push(produtoId)
    })

    // cria e loga usuario nao-admin
    cy.request({ method: 'POST', url: `${Cypress.env('apiUrl')}/usuarios`, headers: { Authorization: adminToken }, body: usuarioNaoAdmin }).then((res) => {
      createdUserIds.push(res.body._id)

      cy.request({ method: 'POST', url: `${Cypress.env('apiUrl')}/login`, body: { email: usuarioNaoAdmin.email, password: usuarioNaoAdmin.password } }).then((loginRes) => {
        const tokenNaoAdmin = loginRes.body.authorization

        const atualizado = { nome: produto.nome + ' - edit', preco: 60, descricao: 'Atualizado', quantidade: 9 }

        cy.request({ method: 'PUT', url: `${Cypress.env('apiUrl')}/produtos/${produtoId}`, headers: { Authorization: tokenNaoAdmin }, body: atualizado, failOnStatusCode: false }).then((res) => {
          if (res.status === 200) {
            throw new Error('BUG: API permitiu que usuário não-admin atualizasse produto de outro (status 200)')
          } else {
            expect([400, 401, 403]).to.include(res.status)
          }
        })
      })
    })
  })

  it('Usuário não-admin não deve conseguir deletar produto de outro', () => {
    // admin cria produto
    const produto = { nome: `ProdutoDel ${Date.now()}`, preco: 80, descricao: 'Para deletar', quantidade: 2 }
    let produtoId

    cy.request({ method: 'POST', url: `${Cypress.env('apiUrl')}/produtos`, headers: { Authorization: adminToken }, body: produto }).then((res) => {
      produtoId = res.body._id
      createdProductIds.push(produtoId)
    })

    // cria e loga usuario nao-admin
    cy.request({ method: 'POST', url: `${Cypress.env('apiUrl')}/usuarios`, headers: { Authorization: adminToken }, body: usuarioNaoAdmin }).then((res) => {
      createdUserIds.push(res.body._id)

      cy.request({ method: 'POST', url: `${Cypress.env('apiUrl')}/login`, body: { email: usuarioNaoAdmin.email, password: usuarioNaoAdmin.password } }).then((loginRes) => {
        const tokenNaoAdmin = loginRes.body.authorization

        cy.request({ method: 'DELETE', url: `${Cypress.env('apiUrl')}/produtos/${produtoId}`, headers: { Authorization: tokenNaoAdmin }, failOnStatusCode: false }).then((res) => {
          if (res.status === 200) {
            throw new Error('BUG: API permitiu que usuário não-admin deletasse produto de outro (status 200)')
          } else {
            expect([400, 401, 403]).to.include(res.status)
          }
        })
      })
    })
  })
})
// Suite de testes de API para produtos. Cobertura: cadastro, duplicidade, atualização e exclusão.
describe('API - Validação de Cadastro, Atualização e Exclusão de Produtos como Admin', () => {
  let token
  let productId
  let produtoFixture

  // Carrega fixture de produtos e autentica um usuário admin antes da suite
  before(() => {
    cy.fixture('produtos').then((produtos) => {
      produtoFixture = produtos
    })
    // Primeiro tenta credenciais providas via `Cypress.env` (ex: CI ou linha de comando)
    const envEmail = Cypress.env('adminEmail')
    const envPassword = Cypress.env('adminPassword')

    const tryLogin = (body) => {
      return cy.request({
        method: 'POST',
        url: `${Cypress.env('apiUrl')}/login`,
        body,
        failOnStatusCode: false
      })
    }

    if (envEmail && envPassword) {
      tryLogin({ email: envEmail, password: envPassword }).then((res) => {
        if (res.status === 200 && res.body.authorization) {
          token = res.body.authorization
          return
        }
      })
    }

    // Em seguida, tenta fixture de login.json
    cy.fixture('login').then((loginF) => {
      tryLogin(loginF.usuarioValido).then((res) => {
        if (res.status === 200 && res.body.authorization) {
          token = res.body.authorization
          return
        }

        // Por fim, tenta fixture usuarios.json
        cy.fixture('usuarios').then((u) => {
          tryLogin({ email: u.loginValido.email, password: u.loginValido.senha }).then((res2) => {
            if (res2.status === 200 && res2.body.authorization) {
              token = res2.body.authorization
            } else {
              throw new Error('Falha ao autenticar admin. Configure credenciais válidas em `Cypress.env` (adminEmail/adminPassword) ou atualize `cypress/fixtures/login.json` / `cypress/fixtures/usuarios.json`.')
            }
          })
        })
      })
    })
  })

  // Cadastro: deve criar um produto e retornar 201 com id
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

  // Validação de duplicidade: cadastrar produto com mesmo nome deve retornar 400
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

  // Atualização: altera os dados do produto previamente criado e espera 200
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
