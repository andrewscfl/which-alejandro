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
    buildAssetsDir: 'assets/'
  },
  
  ssr: false, // Disable server-side rendering for GitHub Pages
  target: 'static'
})
