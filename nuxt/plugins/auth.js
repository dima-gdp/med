import AuthService from '~/domain/services/auth-service/auth-service'

export default function (ctx, inject) {
  let userData
  const authService = new AuthService()

  if (process.client) {
    userData = authService.getUserDataFromLocalStorage()
    authService.synchronizeStorages()
  } else {
    userData = authService.getUserDataFromCookies(ctx.req.headers.cookie)
  }

  ctx.store.commit('user/SET_AUTH', userData)

  // не имеет фактического смысла, только для автокомплита в IDE - inject делает всю работу
  ctx.$auth = ctx.store.state.user

  inject('auth', ctx.store.state.user)
}
