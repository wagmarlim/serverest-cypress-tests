export class CadastroUsuarioAdminPage {
    visitar() {
        cy.visit('https://front.serverest.dev/admin/cadastrarusuarios')
    }

    preencherNome(nome) {
        cy.get('[data-testid="nome"]').type(nome)
    }

    preencherEmail(email) {
        cy.get('[data-testid="email"]').type(email)
    }

    preencherSenha(senha) {
        cy.get('[data-testid="password"]').type(senha)
    }

    marcarAdmin() {
        cy.get('[data-testid="checkbox"]').check({ force: true })
    }

    submeterFormulario() {
        cy.get('[data-testid="cadastrarUsuario"]').click()
    }

}