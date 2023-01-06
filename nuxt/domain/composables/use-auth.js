import { getExistingApiInstance } from '@/api'
import HttpError from '@/domain/errors/http-error'
import LoginError from '../errors/login-error'

export default function useAuth() {
  return {
    async userAuth(userData) {
      const api = getExistingApiInstance()
      const { data } = await api.user.authenticate(userData).catch((e) => {
        if (e instanceof HttpError) {
          throw new LoginError(e.detailMessage)
        } else {
          throw e
        }
      })
      return {
        data,
      }
    },

    async logout(userId) {
      const api = getExistingApiInstance()
      await api.user.logout(userId)
    },

    async loginAsUser({ userId, fromUserId }) {
      const api = getExistingApiInstance()
      await api.user.authByUser({ userId, fromUserId })
    },
  }
}
