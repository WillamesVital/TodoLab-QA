const { defineConfig } = require('cypress');

module.exports = defineConfig({
  env: {
    apiUrl: process.env.CYPRESS_API_URL || 'http://localhost:3001',
  },
  e2e: {
    baseUrl: 'http://localhost:3000',
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    supportFile: 'cypress/support/e2e.js',
    video: false,
  },
});
