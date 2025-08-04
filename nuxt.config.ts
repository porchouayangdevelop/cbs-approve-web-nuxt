// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-05-15",
  devtools: { enabled: false },
  ssr: false,

  imports: {
    autoImport: true,
  },

  $production: {
    routeRules: {
      "/**": { isr: true },
    },
  },
  // $development: {},
  // $env: {},

  app: {
    head: {
      titleTemplate: "CBS Approve Web- %s",
      link: [
        {
          rel: "icon",
          href: "/images.jpg",
        },
      ],
    },
  },

  // Add router configuration
  router: {},
  experimental: {
    payloadExtraction: false,
  },
  devServer: {
    port: 5000,
  },

  runtimeConfig: {
    public: {
      auth_url: "",
      api_url: "",
      branch_url: "",
      user_base_url: "",
      login: "",
      logout: "",
      refresh_token: "",
      check_token: "",
      role_list: "",
      get_users: "",
      delete_user: "",
      edit_user: "",
      webTitle: "",
      webDescription: "",
      ogImage: "",
      ogType: "website",
      ogUrl: "",
    },
  },
  plugins: [
    "~/plugins/axios.ts",
    "~/plugins/error-handler.ts",
    "~/plugins/network-error.ts",
    "~/plugins/auth-init.ts",
    "~/plugins/token-monitoring.client.ts",
  ],
  modules: [
    // '@nuxt/content',
    "@nuxt/fonts",
    "@nuxt/icon",
    "@nuxt/image",
    "@nuxt/scripts",
    "@nuxt/test-utils",
    "@nuxt/ui",
    "@pinia/nuxt",
    "@vueuse/nuxt",
    "nuxt-swiper",
    "nuxt-lucide-icons", // '@nuxtjs/i18n'
    "@nuxtjs/color-mode",
    "@nuxtjs/google-fonts",
  ],
  lucide: {
    namePrefix: "Icon",
  },
  css: [
    "~/assets/css/main.css",
    "~/assets/css/google-fonts.css",
    // '~/assets/css/variables.css', '~/assets/css/typography.css', '~/assets/css/scrollbar.css'
  ],
  colorMode: {
    classSuffix: "",
  },

  fonts: {
    defaults: {
      weights: [400],
      styles: ["normal", "italic"],
      subsets: [],
    },
  },

  googleFonts: {
    download: false,
    base64: true,
    outputDir: "assets",
    overwriting: true,
    inject: false,
    preload: true,
    stylePath: "css/google-fonts.css",
    fontsDir: "assets/fonts",
    fontsPath: "fonts",
    families: {
      Roboto: true,
      "Noto Sans Lao": {
        wght: "100..400",
        regular: "400",
      },
      Ubuntu: true,
    },
  },

  ui: {
    theme: {
      colors: [
        "primary",
        "secondary",
        "tertiary",
        "info",
        "success",
        "warning",
        "error",
      ],
    },
  },

  // i18n: {
  //   locales: [
  //     {
  //       code: 'en',
  //       name: 'English',
  //       file: 'en.json',
  //       iso: 'en-US'
  //     },
  //     {
  //       code: 'lo',
  //       name: 'ລາວ',
  //       file: 'lo.json',
  //       iso: 'lo-LA'
  //     }
  //   ],
  //   bundle: {
  //     optimizeTranslationDirective: false,
  //   },
  //   lazy: true,
  //   langDir: '../locales', // This should point to your locales directory
  //   defaultLocale: 'en',
  //   strategy: 'prefix_except_default',
  //   detectBrowserLanguage: {
  //     useCookie: true,
  //     cookieKey: 'i18n_redirected',
  //     cookieSecure: true,
  //     // cookieSameSite: 'lax',
  //     redirectOn: 'root',
  //     alwaysRedirect: false,
  //     fallbackLocale: 'en'
  //   },
  //   compilation: {
  //     strictMessage: false // Allow missing translations
  //   },
  //   debug: process.env.NODE_ENV === 'development',
  //   vueI18n: '../i18n.config.ts' // Optional: for advanced configuration
  // },

  vite: {
    optimizeDeps: {
      include: [],
    },
    ssr: {
      noExternal: [],
    },
  },
  nitro: {
    experimental: {
      wasm: true,
    },
    // preset: "node-server",
  },
  alias: {},
});
