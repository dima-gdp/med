import Vue from 'vue'
import { mount } from '@vue/test-utils'
import { SButton, SInput } from '~/components/ui-system'
import flushPromises from '~/utils/flush-promises'
import LoginError from '~/domain/errors/login-error'
import LoginPage from '~/pages/user/sign-in/login'
import { setupValidation } from '~/domain/validation/validation'

const mockCreateAlert = jest.fn()
const mockAuthUser = jest.fn()
const mockRouterPush = jest.fn()

jest.mock('~/domain/composables/useGlobalAlert', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    createAlert: mockCreateAlert,
  })),
}))

jest.mock('~/domain/services/auth-service/auth-service.js', () =>
  jest.fn().mockImplementation(() => ({
    authUser: mockAuthUser,
  })),
)

describe('pages/user/sign-in/login', () => {
  jest.useFakeTimers()
  let wrapper
  const LOGIN_PLACEHOLDER = 'Ваш телефон или e-mail *'
  const PASSWORD_PLACEHOLDER = 'Ваш пароль *'

  beforeEach(() => {
    wrapper = mount(LoginPage, {
      stubs: { 'nuxt-link': true },
      mocks: {
        $router: { push: mockRouterPush },
        $auth: { isLoggedIn: false },
        $nuxt: { context: { from: '/' } },
      },
    })
    setupValidation()
  })

  afterEach(() => {
    mockCreateAlert.mockClear()
    mockAuthUser.mockClear()
  })

  it('Правильные плейсхолдеры у инпутов', () => {
    wrapper.findAllComponents(SInput).wrappers.forEach((w) => {
      if (w.props('type') === 'text') {
        expect(w.props('placeholder')).toBe(LOGIN_PLACEHOLDER)
      } else {
        expect(w.props('placeholder')).toBe(PASSWORD_PLACEHOLDER)
      }
    })
  })

  it('пароль - обязательное поле', async () => {
    wrapper.findAllComponents(SInput).wrappers.forEach((w) => {
      if (w.props('placeholder') === LOGIN_PLACEHOLDER) {
        w.find('input').setValue('some value') // заполнили только логин
      }
    })

    wrapper.findComponent(SButton).trigger('click')

    await flushPromises()

    expect(mockCreateAlert).toHaveBeenCalledWith('Заполните все поля!', 'error', 5000)
  })

  it('логин - обязательное поле', async () => {
    wrapper.findAllComponents(SInput).wrappers.forEach((w) => {
      if (w.props('placeholder') === PASSWORD_PLACEHOLDER) {
        w.find('input').setValue('some value') // заполнили только пароль
      }
    })

    await Vue.nextTick()
    jest.runAllTimers()
    wrapper.findComponent(SButton).trigger('click')

    await flushPromises()

    expect(mockCreateAlert).toHaveBeenCalledWith('Заполните все поля!', 'error', 5000)
  })

  it('если форма заполнена корректно, происходит попытка авторизации', async () => {
    wrapper.findAllComponents(SInput).wrappers.forEach((w) => {
      w.find('input').setValue('some str')
    })
    jest.runAllTimers()
    wrapper.findComponent(SButton).trigger('click')

    await flushPromises()
    expect(mockAuthUser).toHaveBeenCalledWith({ identity: 'some str', password: 'some str' })
  })

  it('при нажатии клавиши enter, происходит попытка авторизации', async () => {
    wrapper.findAllComponents(SInput).wrappers.forEach((w) => {
      w.find('input').setValue('some str')
    })

    jest.runAllTimers()
    wrapper.findComponent(SInput).trigger('keydown.enter')

    await flushPromises()

    expect(mockAuthUser).toHaveBeenCalledWith({ identity: 'some str', password: 'some str' })
  })

  it('при ошибке авторизации типа LoginError выбрасывается сообщение из бекенда', async () => {
    wrapper.findAllComponents(SInput).wrappers.forEach((w) => {
      w.find('input').setValue('some str')
    })
    const FAKE_ERROR_MESSAGE = 'fake error message'
    mockAuthUser.mockRejectedValueOnce(new LoginError(FAKE_ERROR_MESSAGE))
    jest.runAllTimers()
    wrapper.findComponent(SButton).trigger('click')
    await flushPromises()

    expect(mockCreateAlert).toHaveBeenCalledWith(FAKE_ERROR_MESSAGE, 'error', 5000)
  })

  it('при неизвестной ошибке авторизации типа выбрасывается предсохраненное сообщение', async () => {
    wrapper.findAllComponents(SInput).wrappers.forEach((w) => {
      w.find('input').setValue('some str')
    })
    mockAuthUser.mockRejectedValueOnce(new Error())
    jest.runAllTimers()
    wrapper.findComponent(SButton).trigger('click')
    await flushPromises()

    expect(mockCreateAlert).toHaveBeenCalledWith(
      'Неизвестная ошибка, попробуйте еще раз',
      'error',
      5000,
    )
  })

  it('Кнопка submit неактивна, пока идет отправка данных', async () => {
    wrapper.findAllComponents(SInput).wrappers.forEach((w) => {
      w.find('input').setValue('some str')
    })

    mockAuthUser.mockImplementationOnce(() => Promise.resolve())

    const btn = wrapper.findComponent(SButton)
    jest.runAllTimers()
    btn.trigger('click')

    await Vue.nextTick()

    expect(btn.props('disabled')).toBeTruthy()
    await flushPromises()
    expect(btn.props('disabled')).toBeFalsy()
  })

  it('Нельзя отправлять форму чаще чем раз в 5 секунд', async () => {
    wrapper.findAllComponents(SInput).wrappers.forEach((w) => {
      w.find('input').setValue('some str')
    })
    jest.runAllTimers()
    wrapper.findComponent(SButton).trigger('click')
    await flushPromises()
    wrapper.findComponent(SButton).trigger('click')
    await flushPromises()
    expect(mockAuthUser).toHaveBeenCalledTimes(1)
  })
})
