import { getExistingApiInstance } from '@/api'

export default function useOrder() {
  async function getOrders(userId, page, perPage) {
    const api = getExistingApiInstance()
    try {
      const params = {
        filter: {
          userId,
        },
        perPage,
        page,
        sort: '-created_at',
        include: 'course-iteration-item,module-item.module-type',
      }
      const { data: orders, meta: pagination } = await api.order.getMany(params)
      return { orders, pagination }
    } catch (e) {
      console.error(e)
    }
  }

  return {
    getOrders,
  }
}
