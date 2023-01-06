import BaseEndpoint from './base-endpoint'

export default class ApiUser extends BaseEndpoint {
  type = 'user'
  url = '/user'
  name = 'user'

  authenticate({ identity, password }) {
    return this.axios.request({
      url: `${this.url}/auth`,
      method: 'POST',
      data: {
        type: 'auth',
        attributes: { identity, password },
      },
    })
  }

  getMenuData(userId) {
    return this.axios.request({
      url: `${this.url}/menu/${userId}`,
      method: 'GET',
    })
  }

  /**
   * @param userId
   * @returns Promise<{ data: { status: boolean }}>
   */
  async logout(userId) {
    await this.axios.request({
      url: `${this.url}/logout`,
      method: 'POST',
      data: {
        type: 'logout',
        attributes: { userId },
      },
    })
  }

  async registration(data) {
    await this.axios.request({
      url: `${this.url}/registration`,
      method: 'post',
      data: {
        type: 'registration',
        attributes: {
          ...data,
        },
      },
    })
  }

  async authByUser({ userId, fromUserId }) {
    await this.axios.request({
      url: `${this.url}/auth-by-user`,
      method: 'POST',
      data: {
        type: 'auth-by-user',
        attributes: { userId, fromUserId },
      },
    })
  }

  getUserRank(params) {
    return this.axios.request({
      url: `${this.url}/rank`,
      method: 'GET',
      params,
    })
  }

  updateUser(id, params) {
    return this.axios.request({
      url: `${this.url}/${id}`,
      method: 'PATCH',
      data: {
        type: 'user',
        attributes: { id, ...params },
      },
    })
  }
}
