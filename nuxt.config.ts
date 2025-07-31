// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  
  ssr: false,
  app: {
    baseURL: process.env.NODE_ENV === 'production' ? '/which-alejandro/' : '/'
  }
})
