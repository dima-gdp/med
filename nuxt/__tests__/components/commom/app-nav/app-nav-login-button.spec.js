import { shallowMount } from '@vue/test-utils'
import AppNavLoginButton from '@/components/common/app-nav/app-nav-login-button.vue'

describe('@/components/common/app-nav/app-nav-login-button.vue', () => {
  let wrapper

  it('Кнопка логина корректно отображается', () => {
    wrapper = shallowMount(AppNavLoginButton, {
      stubs: {
        nuxtLink: true,
      },
    })
    expect(wrapper.html()).toMatchInlineSnapshot(`
      <nuxtlink-stub to="/user/sign-in/login" class="header-desktop-nav__login login-block d-f f-c">
        <evaicon-stub name="person-outline" class="login-block__icon"></evaicon-stub> <span class="t-m-cat"> Вход </span>
      </nuxtlink-stub>
    `)
  })
})
