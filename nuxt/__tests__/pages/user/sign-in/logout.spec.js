import { shallowMount } from '@vue/test-utils'
import LogoutPage from '~/pages/user/sign-in/logout'
import flushPromises from '~/utils/flush-promises'

const mockRouterPush = jest.fn()
const mockLogout = jest.fn()

jest.mock('~/domain/services/auth-service/auth-service', () =>
  jest.fn().mockImplementation(() => ({
    logout: mockLogout,
  })),
)

describe('pages/user/sign-in/logout', () => {
  it('При открытии страницы разлогинивает пользователя и переходит на главную', async () => {
    shallowMount(LogoutPage, {
      mocks: {
        $router: {
          push: mockRouterPush,
        },
      },
    })
    await flushPromises()
    expect(mockRouterPush).toHaveBeenCalledWith('/')
    expect(mockLogout).toHaveBeenCalled()
  })
})
