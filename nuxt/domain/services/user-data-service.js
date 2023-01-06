import useUser from '@/domain/composables/use-user'

export default class UserDataService {
  _store
  constructor(store) {
    this._store = store
  }

  async fetchUserData(userId) {
    this._store.commit('user/SET_USER_DATA_LOADING', true)
    try {
      const userData = await useUser().fetchUserById(userId)
      const userMenuData = await useUser().fetchUserMenuData(userId)
      this._store.commit('user/SET_USER_DATA', userData)
      this._store.commit('user/SET_MENU_DATA', userMenuData)
    } catch (e) {
      console.error(e)
      this._store.commit('user/RESET_AUTH')
    } finally {
      this._store.commit('user/SET_USER_DATA_LOADING', false)
      this._store.commit('user/SET_USER_LOADED')
    }
  }
}
