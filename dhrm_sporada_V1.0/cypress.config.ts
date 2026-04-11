import { defineConfig } from 'cypress'

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:4200',
    supportFile: 'cypress/support/e2e.ts',
    specPattern: 'src/app/**/*.spec.{js,jsx,ts,tsx}',
    setupNodeEvents(on, config) {
      // Implement node event listeners here if needed
    },
  },

  component: {
    devServer: {
      framework: 'angular',
      bundler: 'webpack',
    },
    specPattern: '**/*.spec.ts',
    supportFile: 'src/app/**/*.component.ts',
  },
})
