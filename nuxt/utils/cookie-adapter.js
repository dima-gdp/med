import cookie from 'cookie'

export default class CookieAdapter {
  static cookieParse(rawCookie) {
    return cookie.parse(rawCookie)
  }

  static cookieSerialize({ key, value, options }) {
    return cookie.serialize(key, value, options)
  }

  static serializeDeletedCookie(key) {
    return cookie.serialize(key, '', {
      maxAge: 0,
      path: '/',
    })
  }
}
