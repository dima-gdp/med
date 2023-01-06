import { SyncStorage } from '~/domain/storage/index'

const PREFIX = 'auth_'

export default class LocaleStorage extends SyncStorage {
  static isAvailableGuard() {
    if (!localStorage) {
      console.error('Нет доступа к localStorage!')
    }
  }

  setItem(key, value) {
    if (!value) {
      return
    }
    LocaleStorage.isAvailableGuard()
    localStorage.setItem(PREFIX + key, value)
  }

  /**
   *
   * @param key
   * @returns {string}
   */
  getItem(key) {
    LocaleStorage.isAvailableGuard()
    return localStorage.getItem(PREFIX + key)
  }

  deleteItem(key) {
    LocaleStorage.isAvailableGuard()
    localStorage.removeItem(PREFIX + key)
  }
}
