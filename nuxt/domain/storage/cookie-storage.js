import cookie from 'cookie'
import { SyncStorage } from '~/domain/storage/index'

const PREFIX = 'X-AUTH-'
const EMPTY_VALUE = 'EMPTY_VALUE'

export default class CookieStorage extends SyncStorage {
  static isAvailableGuard() {
    if (!document) {
      console.error('Нет доступа к cookie!')
    }
  }

  static key(k) {
    return (PREFIX + k).toUpperCase()
  }

  setItem(key, value) {
    if (!value) {
      return
    }
    CookieStorage.isAvailableGuard()
    document.cookie = cookie.serialize(CookieStorage.key(key), value, { path: '/' })
  }

  getItem(key) {
    CookieStorage.isAvailableGuard()
    const allCookies = cookie.parse(document.cookie)
    const result = allCookies[CookieStorage.key(key)]
    if (result !== EMPTY_VALUE) {
      return result
    }
  }

  deleteItem(key) {
    CookieStorage.isAvailableGuard()

    document.cookie = cookie.serialize(CookieStorage.key(key), EMPTY_VALUE, {
      maxAge: 0,
      path: '/',
    })
  }

  static readExtCookies(rawCookies, key) {
    const allCookies = cookie.parse(rawCookies)
    return allCookies && allCookies[CookieStorage.key(key)]
  }
}
