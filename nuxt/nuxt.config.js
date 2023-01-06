import * as Sentry from '@sentry/node'
import { ENV_NAMES, getCDNHost, getSentryDSN, APP_NAMES } from './build-vars'
import globalHead from './global-head'

const ENV = process.env.ENV
const APP_VERSION = 'med-public@' + process.env.APP_VERSION

Sentry.init({
  dsn: getSentryDSN(APP_NAMES.PUBLIC),
  tracesSampleRate: 0.25,
  release: APP_VERSION,
  environment: ENV,
})

export default {
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    ...globalHead,
  },

  // Global CSS: https://go.nuxtjs.~~dev/config-css
  css: ['~styles/base/index.scss', '~styles/vendors/eva-icons/index.scss'],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    { src: '~/plugins/api-plugin.js', ssr: true },
    { src: '~/plugins/auth.js' },
    { src: '~/plugins/client-sentry', ssr: false },
    { src: '~/plugins/vee-validate-settings', ssr: false },
    { src: '~/plugins/resize-observer.js' },
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: false,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/typescript
    '@nuxt/typescript-build',
    '@nuxtjs/style-resources',
    '@nuxtjs/google-analytics',
    '@nuxtjs/google-gtag',
    '@nuxtjs/composition-api/module',
    '@nuxt/postcss8',
  ],

  googleAnalytics: {
    id: 'UA-114066768-1',
  },

  'google-gtag': {
    id: 'GTM-NN8SRSZ',
  },

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    // https://go.nuxtjs.dev/pwa
    // '@nuxtjs/pwa',
    // https://www.npmjs.com/package/@nuxtjs/yandex-metrika,
    '@nuxtjs/yandex-metrika',
    // https://www.npmjs.com/package/nuxt-facebook-pixel-module
    // 'nuxt-facebook-pixel-module',
    // https://github.com/web-west/nuxt-vk-rtrg
    [
      'nuxt-vk-rtrg',
      {
        id: 'VK-RTRG-383283-7VcNb',
      },
    ],
    [
      '@qonfucius/nuxt-prometheus-module',
      {
        port: 9091,
        host: '0.0.0.0',
        metrics: {
          collectDefault: true,
          requestDuration: true,
        },
      },
    ],
  ],
  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {},

  // PWA module configuration: https://go.nuxtjs.dev/pwa
  // pwa: {
  //   manifest: {
  //     lang: 'ru',
  //   },
  //   icon: false,
  // },

  yandexMetrika: {
    id: '48993764',
    webvisor: true,
    clickmap: true,
    useCDN: true,
    trackLinks: true,
    accurateTrackBounce: true,
  },

  // Требуется установить nuxt-facebook-pixel-module
  // facebook: {
  //   track: 'PageView',
  //   pixelId: '1028823310652938',
  //   autoPageView: true,
  //   disabled: ENV !== ENV_NAMES.PROD,
  // },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    transpile: ['vee-validate/dist/rules'],
    publicPath: getCDNHost(ENV) + '/_nuxt/',
    postcss: {
      plugins: {
        'postcss-discard-duplicates': {},
      },
    },
  },

  publicRuntimeConfig: {
    apiHost: process.env.PUBLIC_API_HOST,
    env: process.env.ENV,
    version: APP_VERSION,
  },

  // use underscore "_" & also file extension ".scss"
  // do not import real styles here!
  styleResources: {
    scss: ['./styles/abstract/_index.scss'],
  },

  server: {
    port: process.env.PUBLIC_PORT || 8000, // default: 3000
    host: '0.0.0.0', // default: localhost,
  },

  env: {
    envName: ENV,
  },

  loading: false,

  telemetry: false,

  hooks: {
    render: {
      errorMiddleware(app) {
        app.use((error, _req, res, next) => {
          if (ENV === ENV_NAMES.LOCAL) {
            next(error)
          } else {
            console.error(error)
            Sentry.captureException(error)
            res.cookie('Cache-Control', 'no-cache')
            res.writeHead(301, { Location: '/static/error.html' })
            res.end()
          }
        })
      },
    },
  },
}
