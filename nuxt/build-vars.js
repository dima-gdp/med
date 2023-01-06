class BuildError extends Error {
  constructor(message) {
    super(message)
    this.type = 'build'
  }
}

function getDomain(url) {
  if (!url) {
    throw new BuildError('Необходимо передать url!')
  }

  let domain

  if (url.includes('https://') || url.includes('http://')) {
    ;[, domain] = url.split('https://')
  } else {
    domain = url
  }
  return domain
}

export const ENV_NAMES = Object.freeze({
  PROD: 'prod',
  STAGE: 'stage',
  APP_REVIEW: 'review',
  LOCAL: 'local',
})

export const APP_NAMES = Object.freeze({
  PUBLIC: 'public',
  APP: 'app',
})

export const SENTRY_DSN_LIST = Object.freeze({
  PUBLIC: 'https://49f9b3225c6c47699d0e046fa303afc8@log.s256.ru/14',
  APP: 'https://e48c458fcdae4bebadaf88f4c52b9536@log.s256.ru/4',
})

export function getSocketHost(env, url = '') {
  const domain = getDomain(url)
  if (env === ENV_NAMES.PROD) {
    return 'https://ws.' + domain
  } else if (env === ENV_NAMES.STAGE) {
    return 'https://ws.' + domain
  } else if (env === ENV_NAMES.APP_REVIEW) {
    return 'https://ws-' + domain
  } else if (env === ENV_NAMES.LOCAL) {
    return 'http://ws-med.s256.xyz:8280'
  } else {
    throw new BuildError(`Неизвестное название окружения: ${env}`)
  }
}

export function getApiUrl(apiVersion) {
  if (![1, 2, 3].includes(+apiVersion)) {
    throw new BuildError(`Несуществующая версия api: ${apiVersion}`)
  }
  return `/api/v${apiVersion}`
}

export function getCDNHost(env) {
  if (env === ENV_NAMES.PROD) {
    return 'https://cdn-prod.med.studio'
  }
  if (env === ENV_NAMES.STAGE) {
    return ''
  }
  return ''
}

export function getSentryDSN(appName) {
  if (appName === APP_NAMES.APP) {
    return SENTRY_DSN_LIST.APP
  } else if (appName === APP_NAMES.PUBLIC) {
    return SENTRY_DSN_LIST.PUBLIC
  } else {
    throw new BuildError(`Не существует приложения с именем ${appName}`)
  }
}

export function getFavicon(env) {
  return {
    rel: 'icon',
    type: 'image/png',
    href:
      env === ENV_NAMES.PROD
        ? getCDNHost(env) + '/static/favicon/favicon-prod-client32x32.png'
        : getCDNHost(env) + '/static/favicon/favicon-dev-client32x32.png',
  }
}
