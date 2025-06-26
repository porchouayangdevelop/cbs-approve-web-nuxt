// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: {enabled: false},
  ssr: false,

  imports: {
    autoImport: true
  },

  $production: {
    routeRules: {
      '/**': {isr: true}
    }
  },
  $development: {},
  $env: {},

  app: {
    head: {
      // title: 'CBS Approve Web',
      titleTemplate: ' CBS Approve Web - %s',
      meta: [{
        charset: 'utf-8',
        content: 'width=device-width, initial-scale=1',
        media: '(prefers-color-scheme: light)',
      },
      ]
    },

    pageTransition: {name: 'fade', mode: 'out-in'},
  },

  devServer: {
    port: 5000,
    host: '0.0.0.0'
  },

  runtimeConfig: {
    auth_base_url: '',
    api_base_url: '',
    login: '',
    logout: '',
    refreshToken: '',
    check_token: '',
    role_list: '',
    delete_user: '',
    edit_user: '',
    public: {
      webTitle: '',
      webDescription: '',
      ogImage: '',
      ogType: 'website',
      ogUrl: ''
    },

  },
  plugins: [
    '~/plugins/axios.ts',
  ],
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
  css: ['~/assets/css/main.css',
    // '~/assets/css/variables.css', '~/assets/css/typography.css', '~/assets/css/scrollbar.css'
  ],
  colorMode: {
    classSuffix: ''
  }
})