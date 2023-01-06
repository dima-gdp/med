/**
 * @module AuthService
 * Впервые сами писали ssr-авторизацию, накопили костылей, было бы неплохо сделать по красоте
 */

import UserDataService from '~/domain/services/user-data-service'
import useAuth from '~/domain/composables/use-auth'
import LocaleStorage from '~/domain/storage/locale-storage'
import CookieStorage from '~/domain/storage/cookie-storage'
import { SyncStorage } from '~/domain/storage'
import LogicError from '~/domain/errors/LogicError'

class AuthStorage extends SyncStorage {
  #cookieStorage = new CookieStorage()
  #localStorage = new LocaleStorage()

  get isAvailableGuard() {
    return !!document
  }

  getItem(key) {
    return this.#localStorage.getItem(key)
  }

  setItem(key, value) {
    this.#localStorage.setItem(key, value)
    this.#cookieStorage.setItem(key, value)
  }

  deleteItem(key) {
    this.#localStorage.deleteItem(key)
    this.#cookieStorage.deleteItem(key)
  }
}

export default class AuthService {
  storage = new AuthStorage()
  _store

  constructor(store) {
    this._store = store
  }

  _setAuthData(userData) {
    this.storage.setItem('token', userData.token)
    this.storage.setItem('userId', userData.userId)
    this.storage.setItem('fromUserId', userData.fromUserId)
  }

  /**
   * @returns {{fromUserId?: string, userId?: string, token?: string}}
   */
  getUserDataFromLocalStorage() {
    return {
      token: this.storage.getItem('token'),
      userId: this.storage.getItem('userId'),
      fromUserId: this.storage.getItem('fromUserId'),
    }
  }

  /**
   * @param {string} rawCookies
   * @returns {{fromUserId?: string, userId?: string, token?: string}}
   */
  getUserDataFromCookies(rawCookies = '') {
    const token = CookieStorage.readExtCookies(rawCookies, 'token')
    const userId = CookieStorage.readExtCookies(rawCookies, 'userId')
    const fromUserId = CookieStorage.readExtCookies(rawCookies, 'fromUserId')

    return { token, userId, fromUserId }
  }

  _clearUserData() {
    this.storage.deleteItem('token')
    this.storage.deleteItem('userId')
    this.storage.deleteItem('fromUserId')
    this._store.commit('user/RESET_AUTH')
  }

  async logout() {
    if (this._store.state.user.userId) {
      await useAuth().logout(this._store.state.user.userId)
    }
    this._clearUserData()
  }

  /**
   * Метод синхронизирует авторизационные данные в двух хранилищах
   * (на случай если они там отличаются)
   * Запускать только на клиенте
   */
  synchronizeStorages() {
    if (!this.storage.isAvailableGuard) {
      throw new LogicError('Попытка доступа к браузерному апи с серверной части')
    }
    const token = this.storage.getItem('token')
    const userId = this.storage.getItem('userId')
    const fromUserId = this.storage.getItem('fromUserId')
    this._setAuthData({ token, userId, fromUserId })
  }

  /**
   * @param {string} identity
   * @param {string} password
   * @returns {Promise<void>}
   */
  async authUser({ identity, password }) {
    const { data } = await useAuth().userAuth({ identity, password })
    this._setAuthData(data)
    this._store.commit('user/SET_AUTH', data)
    const userDataService = new UserDataService(this._store)
    await userDataService.fetchUserData(data.userId)
  }

  async authAdminAsUser({ userId, fromUserId, token }) {
    this._setAuthData({ userId, token, fromUserId })
    this._store.commit('user/RESET_AUTH')
    this._store.commit('user/SET_AUTH', { userId, token, fromUserId })
    await useAuth().loginAsUser({ userId, fromUserId })
  }
}
