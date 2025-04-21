import './commands' // importa comandos customizados
import 'cypress-file-upload' //importa comando para fazer upload de arquivos

// Hook global para tirar screenshot em caso de falha
afterEach(function () {
    if (this.currentTest.state === 'failed') {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
      const testName = this.currentTest.fullTitle().replace(/ /g, '_')
      const fileName = `${testName}-${timestamp}`
      cy.log(`Test failed: ${this.currentTest.title}`)
      cy.screenshot(fileName)
    }
  })