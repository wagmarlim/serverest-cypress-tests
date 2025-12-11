// Page Object para cadastro/edição de usuários via painel admin.
// Fornece métodos para navegar, preencher campos e submeter o formulário.
export class CadastroUsuarioAdminPage {
    // Navega até a página de cadastro de usuários do admin
    visitar() {
        cy.visit('https://front.serverest.dev/admin/cadastrarusuarios')
    }

    // Insere o nome do usuário
    preencherNome(nome) {
        cy.get('[data-testid="nome"]').type(nome)
    }

    // Insere o email do usuário
    preencherEmail(email) {
        cy.get('[data-testid="email"]').type(email)
    }

    // Insere a senha do usuário
    preencherSenha(senha) {
        cy.get('[data-testid="password"]').type(senha)
    }

    // Marca o checkbox de administrador (force para garantir ação em elementos ocultos)
    marcarAdmin() {
        cy.get('[data-testid="checkbox"]').check({ force: true })
    }

    // Submete o formulário de cadastro/edição
    submeterFormulario() {
        cy.get('[data-testid="cadastrarUsuario"]').click()
    }

}