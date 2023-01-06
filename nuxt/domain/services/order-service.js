import { fromStampToString } from '~/utils'
import useOrder from '~/domain/composables/use-order'

export default class OrderService {
  static ORDERS_PER_PAGE = 10

  static async getOrdersList(userId, page = 1) {
    try {
      const { orders, pagination } = await useOrder().getOrders(userId, page, this.ORDERS_PER_PAGE)

      let ordersList = []

      if (orders.length) {
        ordersList = this._reformatOrders(orders)
      }

      return { ordersList, pagination }
    } catch (e) {
      console.error(e)
    }
  }

  static _reformatOrders(orders) {
    const dateOrdersMap = {}

    orders.forEach((order) => {
      if (dateOrdersMap[fromStampToString(order.createdAt)]) {
        dateOrdersMap[fromStampToString(order.createdAt)].push(order)
      } else {
        dateOrdersMap[fromStampToString(order.createdAt)] = [order]
      }
    })

    const ordersList = Object.entries(dateOrdersMap).map(([date, order]) => ({
      date,
      list: order,
    }))

    return ordersList
  }
}
