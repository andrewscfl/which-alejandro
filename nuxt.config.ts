export default defineNuxtConfig({
  app: {
    baseURL: '/which-alejandro/',
    buildAssetsDir: '_nuxt/'    
  },
  nitro: {
    preset: 'static'
  },
  routeRules: {
    // optional but helps ensure 404s redirect to index.html
    '/**': { static: true }
  }
})
