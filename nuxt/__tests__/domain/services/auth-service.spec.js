import { mockUserAuthFixture } from '@/api/mocs/api-user-mock'
import AuthService from '~/domain/services/auth-service/auth-service.js'

const mockLogout = jest.fn().mockResolvedValue(true)

jest.mock('~/domain/storage/locale-storage', () =>
  jest.fn().mockImplementation(() => mockLocaleStorage),
)

jest.mock('@/domain/services/user-data-service', () =>
  jest.fn().mockImplementation(() => ({
    fetchUserData: mockFetchUserData,
  })),
)

const mockUserAuth = jest.fn()

jest.mock('~/domain/composables/use-auth', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    userAuth: mockUserAuth,
    logout: mockLogout,
  })),
}))

const mockFetchUserData = jest.fn()

const mockLocaleStorage = {
  getItem: jest.fn(() => FAKE_VALUE),
  setItem: jest.fn(),
  deleteItem: jest.fn(),
}

const FAKE_VALUE = 'fake value'

describe('domain/services/auth-service', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })
  describe('пользователь авторизован', () => {
    const FAKE_USER_ID = 'fake user id'

    const fakeStore = {
      state: {
        user: {
          userId: FAKE_USER_ID,
        },
      },
      commit: jest.fn(),
    }
    let authService

    beforeAll(() => {
      mockUserAuth.mockResolvedValue({ data: mockUserAuthFixture })
    })

    beforeEach(() => {
      authService = new AuthService(fakeStore)
    })
    it('Метод getUserDataFromLocalStorage получает данные из localStorage и возвращает их', () => {
      const authData = authService.getUserDataFromLocalStorage()
      expect(authData).toMatchObject({ token: FAKE_VALUE, userId: FAKE_VALUE })
    })

    it('Метод logout удаляет данные из localStorage и Store, отпарвлят запрос logout если пользователь был авторизован', async () => {
      await authService.logout()
      expect(mockLogout).toHaveBeenCalledWith(FAKE_USER_ID)
      expect(mockLocaleStorage.deleteItem).toHaveBeenCalledWith('token')
      expect(mockLocaleStorage.deleteItem).toHaveBeenCalledWith('userId')
      expect(fakeStore.commit).toHaveBeenCalledWith('user/RESET_AUTH')
    })

    it('Метод authUser устанавливает авторизационные данные и обновляет стор', async () => {
      const userParams = {
        identity: 'admin@s256.dev',
        password: 'admin',
      }

      await authService.authUser(userParams)

      expect(mockLocaleStorage.setItem).toHaveBeenCalledWith('token', mockUserAuthFixture.token)
      expect(mockLocaleStorage.setItem).toHaveBeenCalledWith('userId', mockUserAuthFixture.userId)

      expect(mockFetchUserData).toHaveBeenCalledWith(mockUserAuthFixture.userId)
    })
  })

  describe('пользователь не авторизован', () => {
    const fakeStoreNoAuth = {
      state: {
        user: {
          userId: null,
        },
      },
      commit: jest.fn(),
    }
    let authService

    beforeAll(() => {
      mockUserAuth.mockResolvedValue({ data: mockUserAuthFixture })
    })

    beforeEach(() => {
      authService = new AuthService(fakeStoreNoAuth)
    })
    it('Метод logout удаляет данные из localStorage и Store, не отправят запрос logout если пользователь не был авторизован', async () => {
      await authService.logout()
      expect(mockLogout).not.toHaveBeenCalled()
      expect(mockLocaleStorage.deleteItem).toHaveBeenCalledWith('token')
      expect(mockLocaleStorage.deleteItem).toHaveBeenCalledWith('userId')
      expect(fakeStoreNoAuth.commit).toHaveBeenCalledWith('user/RESET_AUTH')
    })
  })
})
