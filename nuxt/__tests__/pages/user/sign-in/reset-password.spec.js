import { mount } from '@vue/test-utils'
import Vue from 'vue'
import Vuex from 'vuex'
import {
  mockPasswordResetSuccessFixture,
  mockPasswordResetFailFixture,
} from '~/api/mocs/api-token-mock'
import { setupValidation } from '~/domain/validation/validation'
import flushPromises from '~/utils/flush-promises'
import ResetPassword from '~/pages/user/sign-in/reset-password.vue'
import useToken from '~/domain/composables/use-token'
import LoginError from '~/domain/errors/login-error'

// TODO: Поправить тесты(которые с throttle)

const mockCreateAlert = jest.fn()
const mockPasswordReset = jest.fn()
const mockAuthUser = jest.fn()
const mockRouterPush = jest.fn()

jest.mock('~/domain/services/auth-service/auth-service.js', () =>
  jest.fn().mockImplementation(() => ({
    authUser: mockAuthUser,
  })),
)

jest.mock('~/domain/composables/useGlobalAlert', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    createAlert: mockCreateAlert,
  })),
}))

jest.mock('~/domain/composables/use-token', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    passwordReset: mockPasswordReset,
  })),
}))

Vue.use(Vuex)

describe('~/pages/user/sign-in/reset-password.vue', () => {
  jest.useFakeTimers()
  let wrapper
  let store
  setupValidation()
  function getRouterMockIfNeeded(isNeedRouter) {
    if (isNeedRouter) {
      return { push: mockRouterPush }
    }
    return undefined
  }

  function getAuthMock(isLoggedIn) {
    return { isLoggedIn }
  }
  const findButtonByText = (text) =>
    wrapper.findAll('button').wrappers.find((w) => w.text() === text)
  const passwordInput = () =>
    wrapper
      .findAll('input')
      .wrappers.find((el) => el.attributes('placeholder') === 'Введите новый пароль')
  const repeatPasswordInput = () =>
    wrapper
      .findAll('input')
      .wrappers.find((el) => el.attributes('placeholder') === 'Введите новый пароль ещё раз')
  const passwordInputs = () => [passwordInput(), repeatPasswordInput()]
  const SET_PASSWORD_BTN_TEXT = 'Сохранить новый пароль и авторизоваться'
  const PASSWORD_RESET_SUCCESS_TEXT = 'Пароль успешно изменен'
  const BASE_TEL = '79999999999'
  const BASE_TOKEN_ID = '1234567'
  const BASE_TOKEN = '1234'
  const createComponent = (
    { isLoggedIn, isNeedRouter } = { isLoggedIn: false, isNeedRouter: false },
  ) => {
    store = new Vuex.Store({
      modules: {
        user: {
          state: {
            isLoggedIn,
          },
          namespaced: true,
        },
      },
    })

    wrapper = mount(ResetPassword, {
      store,
      mocks: {
        $route: {
          query: {
            identity: BASE_TEL,
            tokenId: BASE_TOKEN_ID,
            token: BASE_TOKEN,
          },
        },
        $router: getRouterMockIfNeeded(isNeedRouter),
        $auth: getAuthMock(isLoggedIn),
      },
    })
  }

  afterEach(() => {
    wrapper.destroy()
    mockCreateAlert.mockClear()
  })

  it('Если форма не валидна, то по клику на "восстановить пароль" ничего не делаем', async () => {
    createComponent()
    const passwordResetSpy = jest
      .spyOn(useToken(), 'passwordReset')
      .mockResolvedValue(mockPasswordResetSuccessFixture)
    const inputs = passwordInputs()

    for (let i = 0; i < inputs.length; i++) {
      inputs[i].element.value = '1'
      await inputs[i].trigger('input')
    }
    jest.runAllTimers()
    await findButtonByText(SET_PASSWORD_BTN_TEXT).trigger('click')
    await flushPromises()
    expect(passwordResetSpy).not.toHaveBeenCalled()
    passwordResetSpy.mockRestore()
  })

  it('Если пароли не совпадают, то показываем alert', async () => {
    createComponent()
    const inputs = passwordInputs()

    for (let i = 0; i < inputs.length; i++) {
      inputs[i].element.value = `12345${i}`
      await inputs[i].trigger('input')
    }
    jest.runAllTimers()
    await findButtonByText(SET_PASSWORD_BTN_TEXT).trigger('click')
    await flushPromises()
    expect(mockCreateAlert).toHaveBeenCalled()
  })

  it('Если пароли не совпадают, то не деалем запрос в api', async () => {
    createComponent()
    const passwordResetSpy = jest
      .spyOn(useToken(), 'passwordReset')
      .mockResolvedValue(mockPasswordResetSuccessFixture)
    const inputs = passwordInputs()

    for (let i = 0; i < inputs.length; i++) {
      inputs[i].element.value = `12345${i}`
      await inputs[i].trigger('input')
    }
    jest.runAllTimers()
    await findButtonByText(SET_PASSWORD_BTN_TEXT).trigger('click')
    await flushPromises()
    expect(passwordResetSpy).not.toHaveBeenCalled()
    passwordResetSpy.mockRestore()
  })

  it('Если возникла ошибка в api сброса пароля, то показываем alert', async () => {
    createComponent()
    const passwordResetSpy = jest
      .spyOn(useToken(), 'passwordReset')
      .mockRejectedValue(mockPasswordResetFailFixture)
    const inputs = passwordInputs()

    for (let i = 0; i < inputs.length; i++) {
      inputs[i].element.value = '123456'
      await inputs[i].trigger('input')
    }
    jest.runAllTimers()
    await findButtonByText(SET_PASSWORD_BTN_TEXT).trigger('click')
    await flushPromises()
    expect(mockCreateAlert).toHaveBeenCalled()
    passwordResetSpy.mockRestore()
  })

  it('Если пароль успешно сменили, показываем успешный alert', async () => {
    createComponent()
    mockPasswordReset.mockResolvedValue(mockPasswordResetSuccessFixture)
    const inputs = passwordInputs()

    for (let i = 0; i < inputs.length; i++) {
      inputs[i].element.value = '123456'
      await inputs[i].trigger('input')
    }

    jest.runAllTimers()
    await findButtonByText(SET_PASSWORD_BTN_TEXT).trigger('click')
    await flushPromises()
    expect(mockCreateAlert).toHaveBeenCalledWith(PASSWORD_RESET_SUCCESS_TEXT, 'success')
  })

  it('Если пароль успешно сменили, происходит попытка авторизации', async () => {
    createComponent()
    mockPasswordReset.mockResolvedValue(mockPasswordResetSuccessFixture)
    const inputs = passwordInputs()

    for (let i = 0; i < inputs.length; i++) {
      inputs[i].element.value = '123456'
      await inputs[i].trigger('input')
    }

    jest.runAllTimers()
    await findButtonByText(SET_PASSWORD_BTN_TEXT).trigger('click')
    await flushPromises()
    expect(mockAuthUser).toHaveBeenCalledWith({ identity: BASE_TEL, password: '123456' })
  })

  it('Если авторизация прошла успешно, отправляем пользователя на главную', async () => {
    createComponent({ isLoggedIn: false, isNeedRouter: true })
    mockPasswordReset.mockResolvedValue(mockPasswordResetSuccessFixture)
    const inputs = passwordInputs()

    for (let i = 0; i < inputs.length; i++) {
      inputs[i].element.value = '123456'
      await inputs[i].trigger('input')
    }
    jest.runAllTimers()
    await findButtonByText(SET_PASSWORD_BTN_TEXT).trigger('click')
    await flushPromises()
    expect(mockRouterPush).toHaveBeenCalledWith({ path: '/' })
  })

  it('При ошибке авторизации типа LoginError выбрасывается сообщение из бекенда', async () => {
    createComponent()
    mockPasswordReset.mockResolvedValue(mockPasswordResetSuccessFixture)
    const FAKE_ERROR_MESSAGE = 'fake error message'
    mockAuthUser.mockRejectedValueOnce(new LoginError(FAKE_ERROR_MESSAGE))
    const inputs = passwordInputs()

    for (let i = 0; i < inputs.length; i++) {
      inputs[i].element.value = '123456'
      await inputs[i].trigger('input')
    }
    jest.runAllTimers()
    await findButtonByText(SET_PASSWORD_BTN_TEXT).trigger('click')
    await flushPromises()
    expect(mockCreateAlert).toHaveBeenCalledWith(FAKE_ERROR_MESSAGE, 'error', 5000)
  })

  it('При неизвестной ошибке авторизации показываем алерт', async () => {
    createComponent()
    mockPasswordReset.mockResolvedValue(mockPasswordResetSuccessFixture)
    mockAuthUser.mockRejectedValueOnce(new Error())
    const inputs = passwordInputs()

    for (let i = 0; i < inputs.length; i++) {
      inputs[i].element.value = '123456'
      await inputs[i].trigger('input')
    }
    jest.runAllTimers()
    await findButtonByText(SET_PASSWORD_BTN_TEXT).trigger('click')
    await flushPromises()
    expect(mockCreateAlert).toHaveBeenCalledWith(
      'Неизвестная ошибка, попробуйте еще раз',
      'error',
      5000,
    )
  })

  it('Нельзя отправлять форму чаще чем раз в 5 секунд', async () => {
    createComponent()
    const passwordResetSpy = jest
      .spyOn(useToken(), 'passwordReset')
      .mockRejectedValue(mockPasswordResetSuccessFixture)
    const inputs = passwordInputs()

    for (let i = 0; i < inputs.length; i++) {
      inputs[i].element.value = '123456'
      await inputs[i].trigger('input')
    }
    passwordResetSpy.mockClear()
    jest.runAllTimers()
    await findButtonByText(SET_PASSWORD_BTN_TEXT).trigger('click')
    await flushPromises()
    await findButtonByText(SET_PASSWORD_BTN_TEXT).trigger('click')
    await flushPromises()
    expect(passwordResetSpy).toHaveBeenCalledTimes(1)
    passwordResetSpy.mockRestore()
  })
})
