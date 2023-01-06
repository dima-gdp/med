import useUsersCount from '@/domain/composables/useUsersCount'
import { GET_STATS } from '@/api/mocs/api-user-mock'

const mockStatsApi = jest.fn(async () => await GET_STATS(9))
jest.mock('@/api', () => ({
  getExistingApiInstance: () => ({
    stats: {
      getUserCount: mockStatsApi,
    },
  }),
}))

describe('domain/composables/useUsersCount', () => {
  let usersCountModel

  beforeEach(() => {
    usersCountModel = useUsersCount()
  })

  it('getUsersCount обращается к api за количеством пользователей', async () => {
    await usersCountModel.getUsersCount()

    expect(mockStatsApi).toHaveBeenCalled()
  })

  it('getUsersCount возвращает количество пользователей в виде обьекта с ключами quantity и declination', async () => {
    const usersCount = await usersCountModel.getUsersCount()

    // quantity (String) типа: "123 123"
    // declination (String): "врач, врача, врачей"

    const declination = ['врач', 'врача', 'врачей']

    const formatRegex = /^[0-9]{1,3}()\s([0-9]{3}\s?)+$/gm
    expect(usersCount.quantity).toEqual(expect.stringMatching(formatRegex))
    expect(declination).toContain(usersCount.declination)
  })
})
