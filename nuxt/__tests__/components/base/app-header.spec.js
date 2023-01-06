import { mount } from '@vue/test-utils'
import AppHeader from '@/components/base/app-header'
import {
  mockPossibleMenuItemsFixture,
  mockUserDataFixture,
  mockUserMenuFixture,
} from '~/api/mocs/api-user-mock'
import AppNavDesktop from '~/components/common/app-nav/app-nav-desktop'
import AppNavMobile from '~/components/common/app-nav/app-nav-mobile'

const mockFetchUserData = jest.fn()

jest.mock('~/domain/services/user-data-service', () =>
  jest.fn().mockImplementation(() => ({
    fetchUserData: mockFetchUserData,
  })),
)

describe('@/components/base/app-header.vue', () => {
  let wrapper

  it('проверяем вызывается ли метод fetchUserData при авторизованом пользователе', () => {
    wrapper = mount(AppHeader, {
      stubs: {
        nuxtLink: true,
      },
      mocks: {
        $store: {
          state: {
            user: {
              isLoggedIn: true,
              menu: mockUserMenuFixture,
              userData: {
                mockUserDataFixture,
                profile: {
                  ...mockUserDataFixture.profile,
                },
              },
              userDataIsLoading: false,
              userId: 9,
              userToken: 'eVLcXHtojhi3AB5tHC0wQSdAzl979qystHGTBysb',
            },
          },
        },
        $auth: {
          isAdminAsUser: false,
        },
      },
    })
    expect(mockFetchUserData).toHaveBeenCalled()
  })

  it('проверяем какие значения отдаем в дочерние компоненты без авторизации ', () => {
    wrapper = mount(AppHeader, {
      stubs: {
        nuxtLink: true,
      },
      mocks: {
        $store: {
          state: {
            user: {
              isLoggedIn: false,
            },
          },
        },
        $auth: {
          isAdminAsUser: false,
        },
      },
    })

    const props = {
      user: {},
      userMenu: [],
      isLoading: false,
    }

    // Desktop menu
    expect(wrapper.findComponent(AppNavDesktop).props()).toEqual(props)

    // Mobile menu
    expect(wrapper.findComponent(AppNavMobile).props()).toEqual(props)
  })

  it('проверяем какие значения отдаем в дочерние компоненты с авторизацией', () => {
    wrapper = mount(AppHeader, {
      stubs: {
        nuxtLink: true,
      },
      mocks: {
        $store: {
          state: {
            user: {
              isLoggedIn: true,
              menu: mockUserMenuFixture,
              userData: {
                ...mockUserDataFixture,
              },
              userDataIsLoading: false,
              userId: 9,
              userToken: 'eVLcXHtojhi3AB5tHC0wQSdAzl979qystHGTBysb',
            },
          },
        },
        $auth: {
          isAdminAsUser: false,
        },
      },
    })

    const props = {
      user: {
        ...mockUserDataFixture,
      },
      userMenu: mockPossibleMenuItemsFixture,
      isLoading: false,
    }

    // Desktop menu
    expect(wrapper.findComponent(AppNavDesktop).props().isLoading).toEqual(props.isLoading)
    expect(wrapper.findComponent(AppNavDesktop).props().userMenu).toEqual(props.userMenu)
    expect(wrapper.findComponent(AppNavDesktop).props().user).toEqual(props.user)

    // Mobile menu
    expect(wrapper.findComponent(AppNavMobile).props().isLoading).toEqual(props.isLoading)
    expect(wrapper.findComponent(AppNavMobile).props().userMenu).toEqual(props.userMenu)
    expect(wrapper.findComponent(AppNavMobile).props().user).toEqual(props.user)
  })
})
