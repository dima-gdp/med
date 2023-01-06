export default function redirectNotLoggedIn({ store, redirect }) {
  if (!store.state.user.isLoggedIn) {
    console.info(
      '[already-auth]: перенаправление не авторизованного пользователя на страницу логина',
    )
    redirect('/user/sign-in/login')
  }
}
