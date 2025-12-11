// Page Object para a listagem de usuários no painel admin.
// Inclui operações para visitar a lista, buscar linhas por email, validar e deletar.
export class ListaUsuariosPage {
    // Visita a rota de listar usuários e aguarda a resposta da API
    visitar() {
        cy.intercept('GET', '**/usuarios').as('getUsuarios') // Intercepta a requisição da lista
        cy.visit('https://front.serverest.dev/admin/listarusuarios')
        cy.wait('@getUsuarios') // Aguarda a resposta da API
        cy.get('table').should('be.visible') // Garante que a tabela está visível
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

    // Procura na tabela a linha que contém o email sem scroll desnecessário
    // Valida que o botão Editar está visível e habilitado
    buscarUsuarioPorEmail(email) {
        // Primeiro, carrega todos os elementos
        this.carregarTodosOsElementos()
        
        // Usa filter para encontrar a linha do usuário sem fazer scroll
        cy.get('table tbody tr').filter((index, element) => {
            return Cypress.$(element).text().includes(email)
        }).first().as('linhaUsuario')
        
        // Valida que o botão Editar está visível e habilitado (falha rápido se não estiver)
        cy.get('@linhaUsuario').within(() => {
            cy.contains('button', 'Editar', { timeout: 5000 })
                .should('be.visible')
                .should('not.be.disabled')
        })
    }

    // Valida que a linha encontrada contém o email esperado
    validarUsuarioEncontrado(email) {
        cy.get('@linhaUsuario').should('contain.text', email)
        cy.get('@linhaUsuario').within(() => {
            cy.contains('button', 'Editar').should('be.visible')
        })
    }

    // Deleta o usuário referenciado por `@linhaUsuario`, interceptando a requisição
    deletarUsuario(email) {
        cy.intercept('DELETE', '**/usuarios/**').as('deleteUser')

        cy.get('@linhaUsuario').within(() => {
            cy.contains('Excluir').click()
        })

        cy.wait('@deleteUser')

        cy.get('table').contains('td', email).should('not.exist')
    }

    // Clica no botão Editar do usuário encontrado com tratamento de delays e animações
    editarUsuario() {
        // Intercepta a requisição para carregar os dados do usuário
        cy.intercept('GET', '**/usuarios/**').as('getUsuario')
        
        // Intercepta a navegação para a rota de edição
        let navigationHappened = false
        cy.on('url:changed', () => {
            navigationHappened = true
        })
        
        cy.get('@linhaUsuario').within(() => {
            // Force: true ignora overlays e animações CSS
            cy.contains('button', 'Editar')
                .should('be.visible')
                .should('not.be.disabled')
                .click({ force: true })
        })

        // Aguarda a requisição para carregar os dados do usuário
        cy.wait('@getUsuario', { timeout: 10000 })
        
        // Valida que a URL foi alterada para a página de edição
        cy.url({ timeout: 10000 }).should('include', '/admin/cadastrarusuarios')
            .then(() => {
                if (!navigationHappened) {
                    cy.log('Aviso: URL foi alterada mas sem evento de navegação detectado')
                }
            })
    }
}