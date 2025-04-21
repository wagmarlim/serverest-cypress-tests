import './commands' // importa comandos customizados
import 'cypress-file-upload' //importa comando para fazer upload de arquivos

// Comando customizado para screenshot com timestamp
Cypress.Commands.add('screenshotWithTimestamp', (prefix = 'evidencia') => {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
    const fileName = `${prefix}-${timestamp}`
    cy.screenshot(fileName)
  })