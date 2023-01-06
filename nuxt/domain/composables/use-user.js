import { getExistingApiInstance } from '@/api'
import EntityUser from '@/domain/entities/entity-user'
import LogicError from '@/domain/errors/LogicError'

/**
 * @typedef {Array<{
 *   type: string,
 *   visible: boolean
 * }>} Menu
 */

/**
 * @typedef {{
 *    userId: number,
 *    positionId: number,
 *    companyId: number,
 *    firstname: string,
 *    middlename: string,
 *    lastname: string,
 *    avatar: string | null
 * }} UserProfile
 */

/**
 * @typedef {{
 *     id: number,
 *     email: string,
 *     publicIdentity: string,
 *     emailValidate: boolean,
 *     phoneValidate: boolean,
 *     external: boolean
 *     userProfile: UserProfile
 * }} UserModel
 */

export default function useUser() {
  /**
   *
   * @param userId
   * @returns {Promise<UserModel>}
   */
  async function fetchUserById(userId) {
    const API = getExistingApiInstance()
    if (!userId) {
      throw new LogicError('[useUser/fetchUserMenuData]: Не задан userId')
    }

    const { data: userData } = await API.user.getOne(userId, {
      include: 'profile',
    })

    return generateUserDTO(userData)
  }

  function generateUserDTO(userData) {
    const user = new EntityUser(userData)

    return {
      ...userData,
      id: +userData.id,
      publicIdentity: user.getPublicIdentity(),
    }
  }

  /**
   *
   * @param userId
   * @returns {Promise<Menu>}
   */
  async function fetchUserMenuData(userId) {
    const API = getExistingApiInstance()
    if (!userId) {
      throw new LogicError('[useUser/fetchUserMenuData]: Не задан userId')
    }

    const {
      data: { items },
    } = await API.user.getMenuData(userId)

    return items
  }

  /**
   * @param {{
   *   firstName: string,
   *   middleName: string,
   *   lastName: string,
   *   specialityIds: string[],
   *   email: string,
   *   fromRussia: boolean,
   *   phone?: string,
   *   tokenId?: string | number,
   *   password: string,
   *   subscribe: boolean,
   * }} data
   * @returns {Promise<void>}
   */
  async function registerUser(data) {
    const API = getExistingApiInstance()

    // бекенд не валидирует если токен строка
    data.tokenId = Number(data.tokenId)

    if (!data.fromRussia) {
      data.tokenId !== undefined && delete data.tokenId
      data.phone !== undefined && delete data.phone
    }

    await API.user.registration(data)
  }

  /**
   * Получает список юзеров участвующих в акции
   * @param {Object} params
   * @returns {Promise<array>}
   */
  async function getUserRank(params) {
    const api = getExistingApiInstance()
    const { data } = await api.user.getUserRank(params)
    return data
  }

  /**
   * Обновляет данные юзера
   * @param {number | string} id
   * @param {Object} params
   * @returns {Promise<object>}
   */
  async function updateUser(id, params) {
    const api = getExistingApiInstance()
    const { data } = await api.user.updateUser(id, params)
    return data
  }

  return {
    fetchUserById,
    fetchUserMenuData,
    registerUser,
    getUserRank,
    updateUser,
  }
}
