import { nextTick } from 'vue'
import { mount } from '@vue/test-utils'
import AppVerificationModal from '~/components/common/verification-modal/app-verification-modal.vue'
import { mockTokenIdSuccessFixture, mockTokenIdFailFixture } from '~/api/mocs/api-token-mock'
import { setupValidation } from '~/domain/validation/validation'
import flushPromises from '~/utils/flush-promises'
import RequestPasswordReset from '~/pages/user/sign-in/request-password-reset.vue'
import VerificationService from '~/domain/services/verification-service'
import { METHODS_TOKEN_VERIFICATION, TYPES_TOKEN_VERIFICATION } from '~/utils/constants'

const mockCreateAlert = jest.fn()
const mockRouterPush = jest.fn()
jest.mock('~/domain/composables/useGlobalAlert', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    createAlert: mockCreateAlert,
  })),
}))

jest.mock('~/domain/services/verification-service')

const RESTORE_PASSWORD_BTN_TEXT = 'Восстановить пароль'
const BASE_MAIL = 'qwerty@mail.ru'
const BASE_TEL = '79999999999'

describe('~/pages/user/sign-in/request-password-reset.vue', () => {
  let wrapper
  setupValidation()
  jest.useFakeTimers()
  const findButtonByText = (text) =>
    wrapper.findAll('button').wrappers.find((w) => w.text() === text)

  function getRouterMockIfNeeded(isNeedRouter) {
    if (isNeedRouter) {
      return { push: mockRouterPush }
    }
    return undefined
  }

  function getAuthMock(isLoggedIn) {
    return { isLoggedIn }
  }

  function createComponent(
    { isLoggedIn, isNeedRouter, identity } = {
      isLoggedIn: false,
      isNeedRouter: false,
      identity: '',
    },
  ) {
    wrapper = mount(RequestPasswordReset, {
      stubs: {
        NuxtLink: true,
      },
      mocks: {
        $route: { query: { identity } },
        $router: getRouterMockIfNeeded(isNeedRouter),
        $auth: getAuthMock(isLoggedIn),
      },
    })
  }

  afterEach(() => {
    wrapper.destroy()
    mockCreateAlert.mockClear()
  })

  it('Если в урле сохранен identity то он должен быть введен в инпут', () => {
    createComponent({ isNeedRouter: true, isLoggedIn: false, identity: BASE_MAIL })

    expect(wrapper.find('input').element.value).toBe(BASE_MAIL)
  })

  it('Если форма не валидна, то по клику на "восстановить пароль" ничего не делаем', async () => {
    createComponent()

    const getTokenSpy = jest
      .spyOn(VerificationService, 'getToken')
      .mockResolvedValue(mockTokenIdSuccessFixture.id)
    const input = wrapper
      .findAll('input')
      .wrappers.find((el) => el.attributes('placeholder') === 'Ваш телефон или e-mail')
    input.element.value = ''
    await input.trigger('input')
    await nextTick()
    jest.runAllTimers()
    await findButtonByText(RESTORE_PASSWORD_BTN_TEXT).trigger('click')
    await flushPromises()
    expect(getTokenSpy).not.toHaveBeenCalled()
    getTokenSpy.mockRestore()
  })

  it('Если форма валидна, по клику на "восстановить пароль", если введен телефон, получаем токен для телефона', async () => {
    createComponent()
    const getTokenSpy = jest
      .spyOn(VerificationService, 'getToken')
      .mockResolvedValue(mockTokenIdSuccessFixture.id)
    const input = wrapper
      .findAll('input')
      .wrappers.find((el) => el.attributes('placeholder') === 'Ваш телефон или e-mail')
    input.element.value = BASE_TEL
    await input.trigger('input')
    await nextTick()
    jest.runAllTimers()
    await findButtonByText(RESTORE_PASSWORD_BTN_TEXT).trigger('click')
    await flushPromises()
    expect(getTokenSpy).toHaveBeenCalledWith(
      METHODS_TOKEN_VERIFICATION.TEL,
      BASE_TEL,
      TYPES_TOKEN_VERIFICATION.PASSWORD_RESET,
    )
    getTokenSpy.mockRestore()
  })

  it('Если форма валидна, по клику на "восстановить пароль", если введена почта, получаем токен для почты', async () => {
    createComponent()
    const getTokenSpy = jest
      .spyOn(VerificationService, 'getToken')
      .mockResolvedValue(mockTokenIdSuccessFixture.id)
    const input = wrapper
      .findAll('input')
      .wrappers.find((el) => el.attributes('placeholder') === 'Ваш телефон или e-mail')
    input.element.value = BASE_MAIL
    await input.trigger('input')
    await nextTick()
    jest.runAllTimers()
    await findButtonByText(RESTORE_PASSWORD_BTN_TEXT).trigger('click')
    await flushPromises()
    expect(getTokenSpy).toHaveBeenCalledWith(
      METHODS_TOKEN_VERIFICATION.MAIL,
      BASE_MAIL,
      TYPES_TOKEN_VERIFICATION.PASSWORD_RESET,
    )
    getTokenSpy.mockRestore()
  })

  it('Если токен получен, открываем модалку', async () => {
    createComponent()
    const getTokenSpy = jest
      .spyOn(VerificationService, 'getToken')
      .mockResolvedValue(mockTokenIdSuccessFixture.id)
    const input = wrapper
      .findAll('input')
      .wrappers.find((el) => el.attributes('placeholder') === 'Ваш телефон или e-mail')
    input.element.value = BASE_MAIL
    await input.trigger('input')
    await nextTick()
    jest.runAllTimers()
    await findButtonByText(RESTORE_PASSWORD_BTN_TEXT).trigger('click')
    await flushPromises()
    expect(wrapper.findComponent(AppVerificationModal).props('isOpen')).toBe(true)
    getTokenSpy.mockRestore()
  })

  it('Если произошла ошибка при получении токена, модалку не открываем', async () => {
    createComponent()
    const getTokenSpy = jest
      .spyOn(VerificationService, 'getToken')
      .mockRejectedValue(mockTokenIdFailFixture)
    const input = wrapper
      .findAll('input')
      .wrappers.find((el) => el.attributes('placeholder') === 'Ваш телефон или e-mail')
    input.element.value = BASE_MAIL
    await input.trigger('input')
    await nextTick()
    await findButtonByText(RESTORE_PASSWORD_BTN_TEXT).trigger('click')
    await flushPromises()

    expect(wrapper.findComponent(AppVerificationModal).props('isOpen')).toBe(false)
    getTokenSpy.mockRestore()
  })

  it('Если произошла ошибка при получении токена, показываем alert', async () => {
    createComponent()
    const getTokenSpy = jest
      .spyOn(VerificationService, 'getToken')
      .mockRejectedValue(mockTokenIdFailFixture)
    const input = wrapper
      .findAll('input')
      .wrappers.find((el) => el.attributes('placeholder') === 'Ваш телефон или e-mail')
    input.element.value = BASE_MAIL
    await input.trigger('input')
    await nextTick()
    jest.runAllTimers()
    await findButtonByText(RESTORE_PASSWORD_BTN_TEXT).trigger('click')
    await nextTick()
    await flushPromises()

    expect(mockCreateAlert).toHaveBeenCalled()
    getTokenSpy.mockRestore()
  })

  it('Нельзя отправлять форму чаще чем раз в 5 секунд', async () => {
    createComponent()
    const getTokenSpy = jest
      .spyOn(VerificationService, 'getToken')
      .mockResolvedValue(mockTokenIdSuccessFixture.id)
    const input = wrapper
      .findAll('input')
      .wrappers.find((el) => el.attributes('placeholder') === 'Ваш телефон или e-mail')
    input.element.value = BASE_TEL
    await input.trigger('input')
    await nextTick()
    jest.runAllTimers()
    await findButtonByText(RESTORE_PASSWORD_BTN_TEXT).trigger('click')
    await flushPromises()
    await findButtonByText(RESTORE_PASSWORD_BTN_TEXT).trigger('click')
    await flushPromises()
    expect(getTokenSpy).toHaveBeenCalledTimes(1)
    getTokenSpy.mockRestore()
  })
})
