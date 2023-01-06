import { getExistingApiInstance } from '@/api'

export default function useToken() {
  async function addToken({ userId, type, sendMethod, sendTo }) {
    const api = getExistingApiInstance()
    const { data } = await api.token.create({ userId, type, sendMethod, sendTo })
    return data
  }

  async function tokenValidate({ tokenId, token }) {
    const api = getExistingApiInstance()
    const { data } = await api.token.tokenValidate({ tokenId, token })
    return data
  }

  async function passwordReset({ identity, tokenId, token, password }) {
    const api = getExistingApiInstance()
    const { data } = await api.token.passwordReset({ identity, tokenId, token, password })
    return data
  }

  return {
    addToken,
    tokenValidate,
    passwordReset,
  }
}
