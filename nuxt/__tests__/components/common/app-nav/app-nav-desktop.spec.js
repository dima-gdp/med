import { shallowMount } from '@vue/test-utils'
import AppNavDesktop from '@/components/common/app-nav/app-nav-desktop.vue'
import AppNavLoginButton from '@/components/common/app-nav/app-nav-login-button.vue'
import { mockUserDataFixture, mockPossibleMenuItemsFixture } from '@/api/mocs/api-user-mock'
import AppSkeletonRectangle from '~/components/base/app-sceletons/app-skeleton-rectangle'
import flushPromises from '~/utils/flush-promises'

const SMenuStub = {
  template: '<div><slot name="head"></slot><slot></slot></div>',
}

const SMenuItemStub = {
  template: '<div><slot></slot></div>',
}

const mockLogout = jest.fn()
const mockRouterPush = jest.fn()

jest.mock('~/domain/services/auth-service/auth-service', () =>
  jest.fn().mockImplementation(() => ({
    logout: mockLogout,
  })),
)
function findElementByText({ text, wrapper, selector }) {
  return wrapper.findAll(selector).wrappers.find((w) => w.text() === text)
}

function createComponent({ isLoggedIn, propsData } = { isLoggedIn: true }) {
  return shallowMount(AppNavDesktop, {
    propsData,
    mocks: {
      $auth: {
        isLoggedIn,
      },
      $router: {
        push: mockRouterPush,
      },
    },
    stubs: {
      NuxtLink: true,
      ClientOnly: true,
      SMenu: SMenuStub,
      SMenuItem: SMenuItemStub,
    },
  })
}

const fakeProps = {
  user: {
    publicIdentity: true,
    ...mockUserDataFixture,
  },
  userMenu: mockPossibleMenuItemsFixture,
}

describe('@/components/common/app-nav/app-nav-desktop.vue', () => {
  let wrapper

  it('Если пользователь залогинен, и данные загружены, то выводим меню пользователя', () => {
    wrapper = createComponent({ isLoggedIn: true, propsData: fakeProps })
    expect(wrapper.text()).toContain('Личный кабинет')
  })

  it('Если пользователь залогинен, а данные пользователя не загруженны, то выводим компонент AppSkeletonRectangle', () => {
    wrapper = createComponent()
    expect(wrapper.findComponent(AppSkeletonRectangle).exists()).toBe(true)
  })

  it('Если пользователь не залогинен, то выводим кнопку логина', () => {
    wrapper = createComponent({ isLoggedIn: false })
    expect(wrapper.findComponent(AppNavLoginButton).exists()).toBe(true)
  })

  it('По клику на "Выйти" происходит logout', async () => {
    const wrapper = createComponent({ isLoggedIn: true, propsData: fakeProps })
    const logoutWrapper = findElementByText({
      text: 'Выйти',
      wrapper,
      selector: '.color--cobalt-black',
    })
    logoutWrapper.trigger('click')
    await flushPromises()
    expect(mockRouterPush).toHaveBeenCalledWith({ path: '/' })
    expect(mockLogout).toHaveBeenCalled()
  })
})
