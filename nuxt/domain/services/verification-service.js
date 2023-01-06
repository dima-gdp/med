import useToken from '~/domain/composables/use-token'
import useGlobalAlert from '~/domain/composables/useGlobalAlert'
import { PIN_LENGTH } from '~/utils/constants'
import TEXT from '~/components/common/verification-modal/verification-modal-text'

export default class VerificationService {
  static FALSY_PIN_VALUES = ['', null, undefined, false]

  static async getToken(sendMethod, sendTo, tokenType) {
    const { id: tokenId } = await useToken().addToken({
      type: tokenType,
      sendMethod,
      sendTo,
    })
    return tokenId
  }

  static isDirtyCode(code) {
    if (code.length !== PIN_LENGTH) {
      return true
    } else {
      return !code.every((el) => !this.FALSY_PIN_VALUES.includes(el))
    }
  }

  static async sendCode(code, tokenId, successCB) {
    try {
      const token = code.join('')
      if (!token) {
        return
      }
      const response = await useToken().tokenValidate({ tokenId, token })
      if (response.validate) {
        successCB()
      } else {
        useGlobalAlert().createAlert(TEXT.sendCode.wrongCode, 'error')
      }
    } catch (e) {
      useGlobalAlert().createAlert(TEXT.sendCode.error, 'error')
    }
  }
}
