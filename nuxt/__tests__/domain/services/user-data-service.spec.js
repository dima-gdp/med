import UserDataService from '@/domain/services/user-data-service'
import { mockUserDataFixture, mockUserMenuFixture } from '@/api/mocs/api-user-mock'
import flushPromises from '@/utils/flush-promises'

jest.mock('@/domain/composables/use-user', () => ({
  __esModule: true,
  default: () => mockUseUser,
}))

const mockVuexStore = {
  commit: jest.fn(),
}

const mockUseUser = {
  fetchUserById: jest.fn().mockResolvedValue(mockUserDataFixture),
  fetchUserMenuData: jest.fn().mockResolvedValue(mockUserMenuFixture),
}

describe('domain/services/user-data-service', () => {
  let userDataService
  beforeEach(() => {
    userDataService = new UserDataService(mockVuexStore)
  })

  it('Метод fetchUserData отправляет в стор данные о пользователе и меню', async () => {
    await userDataService.fetchUserData('someId')

    expect(mockVuexStore.commit).toHaveBeenCalledWith('user/SET_USER_DATA', mockUserDataFixture)
    expect(mockVuexStore.commit).toHaveBeenCalledWith('user/SET_MENU_DATA', mockUserMenuFixture)
  })

  it('Метод fetchUserData меняет переключает флаг загрузки в store', async () => {
    userDataService.fetchUserData('someId')

    expect(mockVuexStore.commit).toHaveBeenCalledWith('user/SET_USER_DATA_LOADING', true)
    await flushPromises()
    expect(mockVuexStore.commit).toHaveBeenCalledWith('user/SET_USER_DATA_LOADING', false)
  })

  it('Метод fetchUserData очищает store/user в случае ошибки загрузки', async () => {
    mockUseUser.fetchUserById.mockRejectedValueOnce(new Error())

    await userDataService.fetchUserData('someId')
    expect(mockVuexStore.commit).toHaveBeenCalledWith('user/RESET_AUTH')
  })
})
