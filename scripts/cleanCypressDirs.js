const fs = require('fs-extra')

try {
  fs.emptyDirSync('cypress/screenshots')
  fs.emptyDirSync('cypress/videos')
  console.log('🧹 Pastas limpas com sucesso!')
} catch (err) {
  console.error('Erro ao limpar diretórios:', err)
}