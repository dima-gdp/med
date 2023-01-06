import { getExistingApiInstance } from '@/api'
import { decOfNum } from '~/utils'
export default function useUsersCount() {
  const API = getExistingApiInstance()

  /**
   * Возвращает количество пользователей в базе
   * @returns {Promise<string>}
   */
  async function getUsersCount() {
    const {
      data: { internalCount },
    } = await API.stats.getUserCount()

    return {
      quantity: formatNumber(internalCount),
      declination: decOfNum(internalCount, ['врач', 'врача', 'врачей']),
    }
  }

  function formatNumber(num) {
    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1 ')
  }

  return {
    getUsersCount,
  }
}
