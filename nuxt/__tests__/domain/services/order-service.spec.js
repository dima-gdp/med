import OrderService from '~/domain/services/order-service'
import { mockOrdersListFixture } from '~/api/mocs/api-order-mock'

const USER_ID = 1
const PAGE = 1

const mockGetOrders = jest.fn()

jest.mock('~/domain/composables/use-order', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    getOrders: mockGetOrders,
  })),
}))

describe('~/domain/services/order-service', () => {
  afterEach(() => {
    mockGetOrders.mockClear()
  })

  describe('getOrdersList', () => {
    it('Получает список заказов', async () => {
      mockGetOrders.mockResolvedValue(mockOrdersListFixture.initial)
      await OrderService.getOrdersList(USER_ID, PAGE)
      expect(mockGetOrders).toHaveBeenCalled()
    })

    it('Если прилетает не пустой список, то форматирует список, возвращает его и объект пагинации', async () => {
      mockGetOrders.mockResolvedValue(mockOrdersListFixture.initial)
      const orders = await OrderService.getOrdersList(USER_ID, PAGE)
      expect(orders).toEqual(mockOrdersListFixture.initialFormatted)
    })

    it('Если прилетает пустой список, то отдает пустой массив и объект пагинации', async () => {
      mockGetOrders.mockResolvedValue(mockOrdersListFixture.empty)
      const orders = await OrderService.getOrdersList(USER_ID, PAGE)
      expect(orders).toEqual({ ordersList: [], pagination: mockOrdersListFixture.empty.pagination })
    })
  })
})
