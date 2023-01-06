import { abstractMethod } from '@/utils/oop-helpers'

export class GlobalStorage {
  setItem(_key, _value) {
    abstractMethod()
  }

  /**
   *
   * @returns any
   * @param _key
   */
  getItem(_key) {
    abstractMethod()
  }

  deleteItem(_key) {
    abstractMethod()
  }
}

export class SyncStorage extends GlobalStorage {}

export class AsyncStorage extends GlobalStorage {
  // eslint-disable-next-line require-await
  async setItem(_key, _value) {
    abstractMethod()
  }

  /**
   *
   * @returns {Promise<string>}
   * @param _key
   */
  // eslint-disable-next-line require-await
  async getItem(_key) {
    abstractMethod()
  }
}
