import { shallowMount } from '@vue/test-utils'
import AppNavLoginButton from '@/components/common/app-nav/app-nav-login-button.vue'

describe('@/components/common/app-nav/app-nav-login-button.vue', () => {
  let wrapper

  it('Кнопка логина корректно отображается', () => {
    wrapper = shallowMount(AppNavLoginButton, { stubs: { 'nuxt-link': true } })
    expect(wrapper.html()).toMatchInlineSnapshot(`
      <nuxt-link-stub to="/user/sign-in/login" class="header-desktop-nav__login login-block d-f f-c">
        <evaicon-stub name="person-outline" class="login-block__icon"></evaicon-stub> <span class="t-m-cat"> Вход </span>
      </nuxt-link-stub>
    `)
  })
})
