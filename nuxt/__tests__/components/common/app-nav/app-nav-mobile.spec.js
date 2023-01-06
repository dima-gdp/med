import { shallowMount } from '@vue/test-utils'
import AppNavMobile from '@/components/common/app-nav/app-nav-mobile.vue'
import AppNavLoginButton from '@/components/common/app-nav/app-nav-login-button.vue'
import { mockUserDataFixture, mockPossibleMenuItemsFixture } from '@/api/mocs/api-user-mock'
import AppSkeletonRectangle from '~/components/base/app-sceletons/app-skeleton-rectangle'
import AppNavModalMobile from '~/components/common/app-nav/app-nav-modal-mobile'

const IconMenuStub = {
  template: '<svg>Меню</svg>',
}

describe('@/components/common/app-nav/app-nav-desktop.vue', () => {
  let wrapper

  const findButtonByText = (text) =>
    wrapper.findAll('button').wrappers.find((w) => w.text() === text)

  it('Если пользователь залогинен, а данные пользователя не загруженны, то выводим компонент AppSkeletonRectangle', () => {
    wrapper = shallowMount(AppNavMobile, {
      mocks: {
        $auth: {
          isLoggedIn: true,
        },
      },
      stubs: {
        NuxtLink: true,
      },
    })
    expect(wrapper.findComponent(AppSkeletonRectangle).exists()).toBe(true)
  })

  it('Если пользователь залогинен, и данные пользователя загруженны, то выводим кнопку "личный кабинет"', () => {
    wrapper = shallowMount(AppNavMobile, {
      propsData: {
        user: {
          publicIdentity: true,
          ...mockUserDataFixture,
        },
      },
      mocks: {
        $auth: {
          isLoggedIn: true,
        },
      },
      stubs: {
        NuxtLink: true,
      },
    })

    expect(findButtonByText('Личный кабинет').exists()).toBe(true)
  })

  it('Если пользователь не залогинен, то выводим кнопку логина', () => {
    wrapper = shallowMount(AppNavMobile, {
      mocks: {
        $auth: {
          isLoggedIn: false,
        },
      },
      stubs: {
        NuxtLink: true,
      },
    })
    expect(wrapper.findComponent(AppNavLoginButton).exists()).toBe(true)
  })

  it('По клику на кнопку "Личный кабинет", отрисовываем модалку(меню) личного кабинета и передаем параметр userMenu', async () => {
    wrapper = shallowMount(AppNavMobile, {
      propsData: {
        user: {
          publicIdentity: true,
          ...mockUserDataFixture,
        },
        userMenu: mockPossibleMenuItemsFixture,
      },
      mocks: {
        $auth: {
          isLoggedIn: true,
        },
      },
      stubs: {
        NuxtLink: true,
      },
    })
    await findButtonByText('Личный кабинет').trigger('click')
    expect(wrapper.findComponent(AppNavModalMobile).props().value).toBe(true)
    expect(wrapper.findComponent(AppNavModalMobile).props().content).toBe('user')
    expect(wrapper.findComponent(AppNavModalMobile).props().userMenu).toEqual(
      mockPossibleMenuItemsFixture,
    )
  })

  it('По клику на кнопку "Личный кабинет", отрисовываем модалку(общее меню) и передаем параметр menu', async () => {
    wrapper = shallowMount(AppNavMobile, {
      propsData: {
        user: {
          publicIdentity: true,
          ...mockUserDataFixture,
        },
        userMenu: mockPossibleMenuItemsFixture,
      },
      mocks: {
        $auth: {
          isLoggedIn: true,
        },
      },
      stubs: {
        IconMenu: IconMenuStub,
        NuxtLink: true,
      },
    })

    await findButtonByText('Меню').trigger('click')
    expect(wrapper.findComponent(AppNavModalMobile).props().value).toBe(true)
    expect(wrapper.findComponent(AppNavModalMobile).props().content).toBe('menu')
    expect(wrapper.findComponent(AppNavModalMobile).props().userMenu).toEqual(
      mockPossibleMenuItemsFixture,
    )
  })
})
