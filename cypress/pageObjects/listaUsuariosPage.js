export class ListaUsuariosPage {
    visitar() {
        cy.intercept('GET', '**/usuarios').as('getUsuarios') // Intercepta a requisição da lista
        cy.visit('https://front.serverest.dev/admin/listarusuarios')
        cy.wait('@getUsuarios') // Aguarda a resposta da API
        cy.get('table').should('be.visible') // Garante que a tabela está visível
    }

    buscarUsuarioPorEmail(email) {
        cy.get('table tbody tr', { timeout: 10000 }).should('exist')
        cy.get('table tbody tr').contains(email).should('exist').parents('tr').as('linhaUsuario')
    }

    validarUsuarioEncontrado(email) {
        cy.get('@linhaUsuario').should('contain.text', email)
    }

    deletarUsuario(email) {
        cy.intercept('DELETE', '**/usuarios/**').as('deleteUser')

        cy.get('@linhaUsuario').within(() => {
            cy.contains('Excluir').click()
        })

        cy.wait('@deleteUser')

        cy.get('table').contains('td', email).should('not.exist')
    }
}