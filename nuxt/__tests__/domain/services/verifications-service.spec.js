import {
  mockTokenIdSuccessFixture,
  mockValidateFailFixture,
  mockValidateSuccessFixture,
} from '@/api/mocs/api-token-mock'
import VerificationService from '~/domain/services/verification-service'
import { PIN_LENGTH } from '~/utils/constants'
const mockCreateAlert = jest.fn()
jest.mock('~/domain/composables/useGlobalAlert', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    createAlert: mockCreateAlert,
  })),
}))

const mockAddToken = jest.fn().mockResolvedValue(mockTokenIdSuccessFixture)
const mockTokenValidate = jest.fn()
jest.mock('~/domain/composables/use-token', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    addToken: mockAddToken,
    tokenValidate: mockTokenValidate,
  })),
}))

const mockSuccessCB = jest.fn()
const BASE_CODE = [0, 4, 4, 4]

describe('~/domain/services/verification-service', () => {
  it('Метод getToken, получает данные из апи и tokenId', async () => {
    const tokenId = await VerificationService.getToken()
    expect(tokenId).toBe(mockTokenIdSuccessFixture.id)
  })

  it('Метод sendCode, проверяет в апи валидность токена, если токен валиден, то выполняет колбек', async () => {
    mockTokenValidate.mockResolvedValue(mockValidateSuccessFixture)
    await VerificationService.sendCode(BASE_CODE, '_', mockSuccessCB)
    expect(mockSuccessCB).toHaveBeenCalled()
  })

  it('Метод sendCode, проверяет в апи валидность токена, если токен не валиден, то выдает alert', async () => {
    mockTokenValidate.mockResolvedValue(mockValidateFailFixture)
    await VerificationService.sendCode(BASE_CODE, '_', mockSuccessCB)
    expect(mockCreateAlert).toHaveBeenCalled()
  })

  it('Метод sendCode, проверяет в апи валидность токена, если произошла ошибка, то выдает alert', async () => {
    mockTokenValidate.mockRejectedValue()
    await VerificationService.sendCode(BASE_CODE, '_', mockSuccessCB)
    expect(mockCreateAlert).toHaveBeenCalled()
  })

  it('Если в метод sendCode передан пустой массив, то метод ничего не делает', async () => {
    mockTokenValidate.mockClear()
    await VerificationService.sendCode([], '_', mockSuccessCB)
    expect(mockTokenValidate).not.toHaveBeenCalled()
  })

  it('метод isDirtyCode, возвращает true, если длина кода меньше чем должна быть(4)', () => {
    const code = new Array(PIN_LENGTH - 1)
    const isDirtyCode = VerificationService.isDirtyCode(code)
    expect(isDirtyCode).toBe(true)
  })

  it('метод isDirtyCode, возвращает true, если длина кода меньше чем должна быть(4)', () => {
    const code = new Array(PIN_LENGTH - 1)
    const isDirtyCode = VerificationService.isDirtyCode(code)
    expect(isDirtyCode).toBe(true)
  })

  it('метод isDirtyCode, возвращает true, если хоть один элемент принаджлежит VerificationService.FALSY_PIN_VALUES', () => {
    const falsyCodeVariants = [
      ['', 1, 1, 1],
      [null, 1, 1, 1],
      [false, 1, 1, 1],
      [undefined, 1, 1, 1],
    ]

    falsyCodeVariants.forEach((code) => {
      expect(VerificationService.isDirtyCode(code)).toBe(true)
    })
  })

  it('метод isDirtyCode, возвращает false, если код валидный(нужной длины и не содержит falsy значений кроме 0)', () => {
    const isDirtyCode = VerificationService.isDirtyCode(BASE_CODE)
    expect(isDirtyCode).toBe(false)
  })
})
