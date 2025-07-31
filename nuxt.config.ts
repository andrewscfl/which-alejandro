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
    baseURL: process.env.NODE_ENV === 'production' ? '/which-alejandro/' : '/',
    buildAssetsDir: '_nuxt/',
    cdnURL: process.env.NODE_ENV === 'production' ? '/which-alejandro/' : undefined
  },
  
  // Configure runtime config to ensure all requests use the correct base
  runtimeConfig: {
    app: {
      baseURL: process.env.NODE_ENV === 'production' ? '/which-alejandro/' : '/',
      cdnURL: process.env.NODE_ENV === 'production' ? '/which-alejandro/' : undefined
    }
  },
  
  // Configure Vite build for proper asset handling
  vite: {
    base: process.env.NODE_ENV === 'production' ? '/which-alejandro/' : '/',
    build: {
      assetsDir: '_nuxt/'
    }
  },
  
  ssr: false // Disable server-side rendering for GitHub Pages
})
