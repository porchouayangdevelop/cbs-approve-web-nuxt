// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: {enabled: false},
  ssr: false,

  imports:{
    autoImport:true
  },

  app:{
    head:{
      // title: 'CBS Approve Web',
      titleTemplate:' CBS Approve Web - %s',

    }
  },

  devServer:{
    port: 5000,
    host: '0.0.0.0'
  },

  modules: [
    '@nuxt/content',
    '@nuxt/fonts',
    '@nuxt/icon',
    '@nuxt/image',
    '@nuxt/scripts',
    '@nuxt/test-utils',
    '@nuxt/ui',
    '@pinia/nuxt',
    '@vueuse/nuxt',
    'nuxt-swiper',
    'nuxt-lucide-icons',
    '@nuxtjs/color-mode'
  ],
  lucide: {
    namePrefix: 'Icon'
  },
  css:['~/assets/css/main.css',
    // '~/assets/css/variables.css', '~/assets/css/typography.css', '~/assets/css/scrollbar.css'
  ],
  colorMode: {
    classSuffix: ''
  }
})