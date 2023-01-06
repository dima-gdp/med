import BaseEndpoint from './base-endpoint'

export default class ApiToken extends BaseEndpoint {
  type = 'token'
  url = '/user/token'

  tokenValidate({ tokenId, token }) {
    return this.axios.request({
      url: '/user/token-validate',
      method: 'POST',
      data: {
        type: 'tokenValidate',
        attributes: { tokenId, token },
      },
    })
  }

  passwordReset({ identity, tokenId, token, password }) {
    return this.axios.request({
      url: '/user/password-reset',
      method: 'POST',
      data: {
        type: 'password-reset',
        attributes: { identity, tokenId, token, password },
      },
    })
  }
}
