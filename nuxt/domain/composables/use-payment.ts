import { getExistingApiInstance } from '@/api'

type Payment = {
  id: string
  orderId: number
  userId: number
  invoiceId: string
  paymentMethod: 'bank_card'
  status: 'created' | 'failed' | 'paid'
  paidAt: string | number | null
  confirmationUrl: 'string'
  createdAt: number
  updatedAt: number
  itemUrl: string
  itemType: 'module' | 'course_iteration'
  orderName: string
}

export default function usePayment() {
  /**
   * @param paymentId
   * @return {Payment}
   */
  async function getPayment(paymentId: number | string) {
    const api = getExistingApiInstance()

    try {
      const params = {
        include: 'order',
        // TODO: не работает через CamelCase
        fields: { order: 'item_title,item_url,item' },
      }
      const { data } = await api.payment.getOne(+paymentId, params)
      const orderName = data?.order?.itemTitle ?? ''
      const itemUrl = data?.order?.itemUrl ?? ''
      const itemType = data?.order?.item ?? ''
      delete data.order
      const payment = { ...data, itemUrl, orderName, itemType }

      return payment as Payment
    } catch (e) {
      console.error(e)
    }
  }

  async function createPayment(orderId: any) {
    const api = getExistingApiInstance()
    try {
      const data = {
        orderId,
        paymentMethod: 'bank_card',
      }
      return await api.payment.create(data)
    } catch (e) {
      console.error(e)
    }
  }

  return {
    getPayment,
    createPayment,
  }
}
