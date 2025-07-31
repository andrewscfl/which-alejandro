// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  
  // Configure for GitHub Pages
  nitro: {
    prerender: {
      routes: ['/']
    }
  },
  
  app: {
    baseURL: '/which-alejandro/',
    buildAssetsDir: '_nuxt/',
    cdnURL: '/which-alejandro/'
  },
  
  ssr: false // Disable server-side rendering for GitHub Pages
})
