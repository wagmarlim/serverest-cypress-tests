const { defineConfig } = require('cypress')
const path = require('path')
const fs = require('fs-extra')

module.exports = defineConfig({
    e2e: {
        env: {
            frontendUrl: 'https://front.serverest.dev',
            apiUrl: 'https://serverest.dev'
        },
        supportFile: 'cypress/support/e2e.js',
        setupNodeEvents(on, config) {
            // Limpar screenshots e vídeos antes da execução
            on('before:run', () => {
                const screenshotsPath = path.resolve('cypress/screenshots')
                const videosPath = path.resolve('cypress/videos')

                if (fs.existsSync(screenshotsPath)) {
                    fs.removeSync(screenshotsPath)
                    console.log('🧹 Pasta de screenshots limpa.')
                }

                if (fs.existsSync(videosPath)) {
                    fs.removeSync(videosPath)
                    console.log('🧹 Pasta de vídeos limpa.')
                }
            })

            return config
        },
    },

    screenshotsFolder: 'cypress/screenshots',
    videosFolder: 'cypress/videos',
    video: true,
    screenshotOnRunFailure: true,
})