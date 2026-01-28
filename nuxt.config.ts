// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  // Static site generation
  ssr: true,
  nitro: {
    preset: 'static',
  },

  // Use app/ as source directory
  srcDir: 'app/',

  // Development server configuration
  devServer: {
    port: 4000,
  },

  // Runtime config for environment variables
  runtimeConfig: {
    public: {
      umamiHost: '',
      umamiId: '',
      gtmId: '', // GTM ID for production (TM-WMJSMTWF)
    },
  },

  // App configuration - baseURL controlled by NUXT_APP_BASE_URL env var
  // Default: '/' for local dev and Vercel
  // Production (Spring Boot): '/bookleaf/'
  app: {
    baseURL: process.env.NUXT_APP_BASE_URL || '/',
  },

  modules: ['@nuxt/eslint', '@nuxtjs/seo', '@unocss/nuxt', '@nuxt/image', '@pinia/nuxt'],

  // Global CSS
  css: ['~/assets/css/fonts.css'],

  // Explicitly enable pages directory
  pages: true,

  // Configure components directory for app/ structure
  components: {
    dirs: [
      {
        path: '~/components',
        pathPrefix: false,
      },
    ],
  },

  typescript: {
    strict: true,
    typeCheck: false, // 禁用类型检查以避免构建错误
  },

  site: {
    url: 'https://leaflet.example.com',
    name: 'Leaflet',
    description: 'Make words feel published. Create beautiful text posters with customizable styles, fonts, and layouts. Perfect for quotes, poems, and memorable lines. Easy to use and share.',
    defaultLocale: 'en',
  },

  seo: {
    fallbackTitle: false,
  },

  ogImage: {
    enabled: true,
  },

  sitemap: {
    enabled: true,
  },

  robots: {
    enabled: true,
    robotsTxt: false, // Disable robots.txt generation for subpath deployment
  },

  image: {
    formats: ['webp', 'png', 'jpg'],
    quality: 80,
  },

  vite: {
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['vue', 'vue-router'],
          },
        },
      },
    },
  },
})
