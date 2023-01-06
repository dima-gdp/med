export const state = () => ({
  isLoggedIn: false,
  userId: null,
  userToken: null,
  fromUserId: null,
  userData: {
    profile: {},
    hasPromo: false,
  },
  userDataIsLoading: false,
  menu: null,
  isUserLoaded: false,
})

export const getters = {
  hasCompany: (state) => !!state.userData?.profile?.companyId,
}

export const mutations = {
  SET_AUTH(state, userData) {
    if (userData?.userId && userData?.token) {
      const { userId, token } = userData
      state.isLoggedIn = true
      state.userId = userId
      state.userToken = token
    }
    state.fromUserId = userData?.fromUserId
  },

  RESET_AUTH(state) {
    state.isLoggedIn = false
    state.userId = null
    state.userToken = null
    state.fromUserId = null
    state.userData = { profile: {},  hasPromo: false }
  },

  SET_USER_DATA_LOADING(state, isLoading) {
    state.userDataIsLoading = isLoading
  },

  SET_USER_DATA(state, userData) {
    state.userData = userData
  },

  SET_MENU_DATA(state, userMenuData) {
    state.menu = userMenuData
  },

  SET_USER_LOADED(state) {
    state.isUserLoaded = true
  },

  SET_USER_PROMO(state, hasPromo) {
    state.userData.hasPromo = hasPromo
  },
}
