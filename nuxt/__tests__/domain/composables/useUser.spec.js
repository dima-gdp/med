import useUser from '@/domain/composables/use-user'
import { GET_USER_AND_PROFILE, GET_USER_MENU, mockUserDataFixture } from '@/api/mocs/api-user-mock'
import LogicError from '@/domain/errors/LogicError'

const mockUserApi = jest.fn(async (userId) => await GET_USER_AND_PROFILE(userId))
const mockMenuApi = jest.fn(async (userId) => await GET_USER_MENU(userId))

jest.fn(() => {})
jest.mock('@/api', () => ({
  getExistingApiInstance: () => ({
    user: {
      getOne: mockUserApi,
      getMenuData: mockMenuApi,
    },
  }),
}))

describe('domain/composables/useUser', () => {
  let userModel

  beforeEach(() => {
    userModel = useUser()
  })

  it('fetchUserById выбрасывает LogicError если не задан параметр userId', () => {
    expect(userModel.fetchUserById()).rejects.toThrow(LogicError)
  })

  it('fetchUserById возвращает юзера', async () => {
    const USER_ID = 9
    const userState = await userModel.fetchUserById(USER_ID)

    expect(userState).toEqual(expect.objectContaining(mockUserDataFixture))
  })

  it('fetchUserMenuData выбрасывает LogicError если не задан параметр userId', () => {
    expect(userModel.fetchUserMenuData()).rejects.toThrow(LogicError)
  })

  it('fetchUserMenuData возвращает список пунктов меню юзера', async () => {
    const USER_ID = 9
    const userMenuState = await userModel.fetchUserMenuData(USER_ID)

    expect(userMenuState).toEqual(
      expect.arrayContaining([
        { type: 'panel', visible: true },
        { type: 'profile', visible: true },
        { type: 'subscribe', visible: true },
        { type: 'certificate', visible: true },
        { type: 'curator', visible: false },
        { type: 'course', visible: true },
        { type: 'logout', visible: true },
      ]),
    )
  })
})
