import Vue from 'vue'
import * as Sentry from '@sentry/vue'
import { Integrations } from '@sentry/tracing'
import { ENV_NAMES, getSentryDSN, APP_NAMES } from '../build-vars'

// нужен ли lazy-load этого плагина?
export default function sentryPlugin(ctx, inject) {
  if (ctx.env.envName !== ENV_NAMES.LOCAL) {
    Sentry.init({
      Vue,
      dsn: getSentryDSN(APP_NAMES.PUBLIC),
      environment: ctx.$config.env,
      logErrors: true,
      integrations: [new Integrations.BrowserTracing()],
      tracesSampleRate: 0.25,
      tracingOptions: {
        trackComponents: true,
        hooks: ['create', 'mount'],
      },
      release: ctx.$config.version,
    })

    inject('sentry', Sentry)
  }
}
