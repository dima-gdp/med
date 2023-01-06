import BaseEndpoint from './base-endpoint'

export default class ApiStats extends BaseEndpoint {
  type = 'stats'
  url = '/stats'
  name = 'stats'

  getUserCount() {
    return this.axios.request({
      url: `${this.url}/user/`,
      method: 'GET',
    })
  }
}
