export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  ssr: false,
  devtools: { enabled: true },
  modules: [
    '@nuxt/content',
    '@nuxtjs/i18n',
    '@nuxt/ui',
  ],
  i18n: {
    locales: [{
      code: 'en',
      iso: 'en-US',
      name: 'English(US)',
      file: 'en.json'
    },
    {
      code: 'fr',
      iso: 'fr-FR',
      name: 'Français',
      file: 'fr.json'
    }],
    strategy: 'prefix_except_default',
    defaultLocale: 'en',
    langDir: './',
    vueI18n: './i18n.options.ts',
  },
  plugins: ['~/plugins/passive-events.client.ts'],
  css: ['~/assets/css/main.css'],
  devServer: {
    host: '0.0.0.0',
    port: Number(process.env.NUXT_PORT) || 5555,
  },
  runtimeConfig: {
    public: {
      APP_NAME: process.env.APP_NAME || "app",
    },
    POCKETBASE_URL: process.env.POCKETBASE_URL,

    COOKIE_NAME: process.env.COOKIE_NAME || "__app_session",
    COOKIE_SECRET: process.env.COOKIE_SECRET || "secret",
  }
})