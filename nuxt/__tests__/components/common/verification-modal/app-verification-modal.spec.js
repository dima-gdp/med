import AppVerificationModal from '@/components/common/verification-modal/app-verification-modal.vue'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import { mockTokenIdSuccessFixture, mockTokenIdFailFixture } from '@/api/mocs/api-token-mock'
import { SInputPin } from '~/components/ui-system'
import VerificationService from '~/domain/services/verification-service'
import TEXT from '~/components/common/verification-modal/verification-modal-text'
import { METHODS_TOKEN_VERIFICATION, TYPES_TOKEN_VERIFICATION } from '~/utils/constants'

const BASE_MAIL = 'qwerty@mail.ru'
const BASE_TEL = '79999999999'
const BUTTON_SEND_CODE_TEXT = 'Отправить код'
const TEXT_SMS_BUTTON = 'Подтвердить по телефонному звонку'
const RETURN_BTN_TEXT = 'Вернуться на страницу восстановления пароля'
const LETTER_NOT_SENT_BTN_TEXT = 'Письмо не пришло'
const SENT_LETTER_BTN_TEXT = 'Мы отправили письмо ещё раз'

const mockCreateAlert = jest.fn()
const mockTokenValidate = jest.fn()
jest.mock('~/domain/composables/useGlobalAlert', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    createAlert: mockCreateAlert,
  })),
}))

jest.mock('~/domain/composables/use-token', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    tokenValidate: mockTokenValidate,
  })),
}))

describe('@/components/common/verification-modal', () => {
  jest.useFakeTimers()

  let wrapper
  const findButtonByText = (text) =>
    wrapper.findAll('button').wrappers.find((w) => w.text() === text)
  const toSmsButton = () =>
    wrapper.findAll('button').wrappers.find((w) => w.text().includes(TEXT.call.button))
  const toCallButton = () =>
    wrapper.findAll('button').wrappers.find((w) => w.text().includes(TEXT_SMS_BUTTON))

  const createComponent = (props) => {
    wrapper = mount(AppVerificationModal, {
      propsData: props,
    })
  }

  afterEach(() => {
    wrapper.destroy()
  })

  it('Отрисосывает себя (AppVerificationModal), когда передан параметр (isOpen: true)', () => {
    createComponent({
      isOpen: true,
      type: METHODS_TOKEN_VERIFICATION.TEL,
      contact: BASE_TEL,
      tokenId: mockTokenIdSuccessFixture.id,
    })

    expect(wrapper.text()).toBeTruthy()
  })

  it(' Не отрисосывает себя (AppVerificationModal), когда передан параметр (isOpen: false)', () => {
    createComponent({
      isOpen: false,
      type: METHODS_TOKEN_VERIFICATION.TEL,
      contact: BASE_TEL,
      tokenId: mockTokenIdSuccessFixture.id,
    })

    expect(wrapper.text()).toBeFalsy()
  })

  it('По умолчанию открывает проверку по звонку', () => {
    createComponent({
      isOpen: true,
      contact: BASE_TEL,
      tokenId: mockTokenIdSuccessFixture.id,
    })

    expect(wrapper.text()).toContain(TEXT.call.title)
  })

  it('По умолчанию тип токена(tokenType) передаваемый в запрос = password_reset', async () => {
    createComponent({
      isOpen: true,
      contact: BASE_TEL,
      tokenId: mockTokenIdSuccessFixture.id,
    })

    const getTokenSpy = jest
      .spyOn(VerificationService, 'getToken')
      .mockResolvedValueOnce(mockTokenIdSuccessFixture.id)
    jest.runAllTimers()
    await nextTick()
    await toSmsButton().trigger('click')
    await nextTick()
    await nextTick()
    expect(getTokenSpy).toHaveBeenCalledWith(
      METHODS_TOKEN_VERIFICATION.SMS,
      BASE_TEL,
      TYPES_TOKEN_VERIFICATION.PASSWORD_RESET,
    )
    getTokenSpy.mockRestore()
  })

  it('Получаем нужный тип токена в зависимости от входящего параметра tokenType', async () => {
    createComponent({
      isOpen: true,
      contact: BASE_TEL,
      tokenId: mockTokenIdSuccessFixture.id,
      tokenType: TYPES_TOKEN_VERIFICATION.REGISTRATION,
    })

    const getTokenSpy = jest
      .spyOn(VerificationService, 'getToken')
      .mockResolvedValueOnce(mockTokenIdSuccessFixture.id)
    jest.runAllTimers()
    await nextTick()
    await toSmsButton().trigger('click')
    await nextTick()
    await nextTick()
    expect(getTokenSpy).toHaveBeenCalledWith(
      METHODS_TOKEN_VERIFICATION.SMS,
      BASE_TEL,
      TYPES_TOKEN_VERIFICATION.REGISTRATION,
    )
    getTokenSpy.mockRestore()
  })

  it('При получении токена, емитим токен на вверх', async () => {
    createComponent({
      isOpen: true,
      contact: BASE_TEL,
      tokenId: mockTokenIdSuccessFixture.id,
      tokenType: TYPES_TOKEN_VERIFICATION.REGISTRATION,
    })

    const getTokenSpy = jest
      .spyOn(VerificationService, 'getToken')
      .mockResolvedValueOnce(mockTokenIdSuccessFixture.id)
    jest.runAllTimers()
    await nextTick()
    await toSmsButton().trigger('click')
    await nextTick()
    await nextTick()
    expect(wrapper.emitted('set-token-id')[0][0]).toBe(mockTokenIdSuccessFixture.id)
    getTokenSpy.mockRestore()
  })

  // разобраться с эмитами

  it('Отрисовывает проверку по почте, если передан соответсвующий параметр type', () => {
    createComponent({
      isOpen: true,
      type: METHODS_TOKEN_VERIFICATION.MAIL,
      contact: BASE_MAIL,
      tokenId: mockTokenIdSuccessFixture.id,
    })

    expect(wrapper.text()).toContain(TEXT.email.title)
  })

  it('При выборе подтверждения по телефону, изначально кнопка смены типа верификации на СМС, не доступна', () => {
    createComponent({
      isOpen: true,
      contact: BASE_TEL,
      tokenId: mockTokenIdSuccessFixture.id,
    })

    expect(toSmsButton().attributes('disabled')).toBe('disabled')
  })

  it('После истечения таймера, кнопка смены типа верификации на СМС доступна', async () => {
    createComponent({
      isOpen: true,
      contact: BASE_TEL,
      tokenId: mockTokenIdSuccessFixture.id,
    })

    jest.runAllTimers()
    await nextTick()
    expect(toSmsButton().attributes('disabled')).toBeFalsy()
  })

  it('По клику на кнопку смены типа верификации на СМС, меняется контент компонента', async () => {
    createComponent({
      isOpen: true,
      contact: BASE_TEL,
      tokenId: mockTokenIdSuccessFixture.id,
    })

    const getTokenSpy = jest
      .spyOn(VerificationService, 'getToken')
      .mockResolvedValueOnce(mockTokenIdSuccessFixture.id)
    jest.runAllTimers()
    await nextTick()
    await toSmsButton().trigger('click')
    await nextTick()
    await nextTick()
    expect(wrapper.text()).toContain(TEXT.sms.title)
    expect(wrapper.text()).toContain(TEXT_SMS_BUTTON)
    expect(wrapper.text()).toContain(TEXT.sms.desc)
    getTokenSpy.mockRestore()
  })

  it('По клику на кнопку смены типа верификации на СМС, запрашивается новый токен', async () => {
    createComponent({
      isOpen: true,
      contact: BASE_TEL,
      tokenId: mockTokenIdSuccessFixture.id,
    })

    const getTokenSpy = jest
      .spyOn(VerificationService, 'getToken')
      .mockResolvedValueOnce(mockTokenIdSuccessFixture.id)
    jest.runAllTimers()
    await nextTick()
    await toSmsButton().trigger('click')
    await nextTick()
    await nextTick()
    expect(getTokenSpy).toHaveBeenCalled()
    getTokenSpy.mockRestore()
  })

  it('По клику на кнопку смены типа верификации на СМС, показывает alert, если возникла ошибка', async () => {
    createComponent({
      isOpen: true,
      contact: BASE_TEL,
      tokenId: mockTokenIdSuccessFixture.id,
    })

    const getTokenSpy = jest
      .spyOn(VerificationService, 'getToken')
      .mockRejectedValue(mockTokenIdFailFixture)

    jest.runAllTimers()
    await nextTick()
    await toSmsButton().trigger('click')
    await nextTick()
    await nextTick()
    expect(mockCreateAlert).toHaveBeenCalled()
    getTokenSpy.mockRestore()
  })

  it('По клику на кнопку смены типа верификации на обратно на Телефон (в первоначальное состояние), меняется контент компонента', async () => {
    createComponent({
      isOpen: true,
      contact: BASE_TEL,
      tokenId: mockTokenIdSuccessFixture.id,
    })

    const getTokenSpy = jest
      .spyOn(VerificationService, 'getToken')
      .mockResolvedValue(mockTokenIdSuccessFixture.id)
    jest.runAllTimers()
    await nextTick()
    await toSmsButton().trigger('click')
    await nextTick()
    await nextTick()
    await toCallButton().trigger('click')
    await nextTick()
    await nextTick()
    expect(wrapper.text()).toContain(TEXT.call.title)
    expect(wrapper.text()).toContain(TEXT.call.button)
    expect(wrapper.text()).toContain(TEXT.call.desc)
    getTokenSpy.mockRestore()
  })

  it('Когда не введен код полностью, кнопка отправить не активна', async () => {
    createComponent({
      isOpen: true,
      contact: BASE_TEL,
      tokenId: mockTokenIdSuccessFixture.id,
    })

    const inputs = wrapper.findComponent(SInputPin).findAll('input').wrappers

    for (let i = 0; i < inputs.length - 1; i++) {
      inputs[i].element.value = '1'
      await inputs[i].trigger('input')
    }

    expect(findButtonByText(BUTTON_SEND_CODE_TEXT).attributes('disabled')).toBe('disabled')
  })

  it('Когда код введен полностью, кнопка отправить активна', async () => {
    createComponent({
      isOpen: true,
      contact: BASE_TEL,
      tokenId: mockTokenIdSuccessFixture.id,
    })

    const inputs = wrapper.findComponent(SInputPin).findAll('input').wrappers

    for (let i = 0; i < inputs.length; i++) {
      inputs[i].element.value = '1'
      await inputs[i].trigger('input')
    }

    expect(findButtonByText(BUTTON_SEND_CODE_TEXT).attributes('disabled')).toBeFalsy()
  })

  it('При успешной отправке кода, выводит сообщение(alert)', async () => {
    createComponent({
      isOpen: true,
      contact: BASE_TEL,
      tokenId: mockTokenIdSuccessFixture.id,
    })

    const inputs = wrapper.findComponent(SInputPin).findAll('input').wrappers

    for (let i = 0; i < inputs.length; i++) {
      inputs[i].element.value = '1'
      await inputs[i].trigger('input')
    }

    const sendCodeSpy = jest.spyOn(VerificationService, 'sendCode').mockResolvedValue('we')
    await findButtonByText(BUTTON_SEND_CODE_TEXT).trigger('click')
    expect(sendCodeSpy).toHaveBeenCalled()
    sendCodeSpy.mockRestore()
  })

  it('При успешной отправке кода, емитит событие verification-tel наверх', async () => {
    mockTokenValidate.mockResolvedValue({ validate: true })
    createComponent({
      isOpen: false,
      contact: BASE_TEL,
      type: METHODS_TOKEN_VERIFICATION.TEL,
      tokenId: '',
    })

    wrapper.setProps({ isOpen: true, tokenId: mockTokenIdSuccessFixture.id })
    await nextTick()
    const inputs = wrapper.findComponent(SInputPin).findAll('input').wrappers

    for (let i = 0; i < inputs.length; i++) {
      inputs[i].element.value = '1'
      await inputs[i].trigger('input')
    }

    await findButtonByText(BUTTON_SEND_CODE_TEXT).trigger('click')
    await nextTick()

    expect(wrapper.emitted('verification-tel')[0][0]).toEqual({
      identity: BASE_TEL,
      tokenId: mockTokenIdSuccessFixture.id,
      token: '1111',
    })
  })

  it('По клику на кнопку "вернуться на страницу восстановления пароля", закрывать модалку', async () => {
    createComponent({
      isOpen: true,
      contact: BASE_MAIL,
      type: METHODS_TOKEN_VERIFICATION.MAIL,
      tokenId: mockTokenIdSuccessFixture.id,
    })

    await findButtonByText(RETURN_BTN_TEXT).trigger('click')

    expect(wrapper.emitted('view-modal')[0][0]).toBe(false)
  })

  it('По клику на кнопку "письмо не пришло", отправляет письмо', async () => {
    createComponent({
      isOpen: true,
      contact: BASE_MAIL,
      type: METHODS_TOKEN_VERIFICATION.MAIL,
      tokenId: mockTokenIdSuccessFixture.id,
    })

    const getTokenSpy = jest
      .spyOn(VerificationService, 'getToken')
      .mockResolvedValueOnce(mockTokenIdSuccessFixture.id)
    await findButtonByText(LETTER_NOT_SENT_BTN_TEXT).trigger('click')
    expect(getTokenSpy).toHaveBeenCalled()
    getTokenSpy.mockRestore()
  })

  it('Если возникла ошибка при отправке письма, выводит alert ', async () => {
    createComponent({
      isOpen: true,
      contact: BASE_MAIL,
      type: METHODS_TOKEN_VERIFICATION.MAIL,
      tokenId: mockTokenIdSuccessFixture.id,
    })

    const getTokenSpy = jest
      .spyOn(VerificationService, 'getToken')
      .mockRejectedValue(mockTokenIdFailFixture)
    await findButtonByText(LETTER_NOT_SENT_BTN_TEXT).trigger('click')
    expect(mockCreateAlert).toHaveBeenCalled()
    getTokenSpy.mockRestore()
  })

  it('По клику на кнопку "письмо не пришло", показывает кнопку "мы отправили письмо"', async () => {
    createComponent({
      isOpen: true,
      contact: BASE_MAIL,
      type: METHODS_TOKEN_VERIFICATION.MAIL,
      tokenId: mockTokenIdSuccessFixture.id,
    })

    const getTokenSpy = jest
      .spyOn(VerificationService, 'getToken')
      .mockResolvedValueOnce(mockTokenIdSuccessFixture.id)
    await findButtonByText(LETTER_NOT_SENT_BTN_TEXT).trigger('click')
    await nextTick()
    await nextTick()
    expect(wrapper.html()).toContain(SENT_LETTER_BTN_TEXT)
    getTokenSpy.mockRestore()
  })

  it('По клику на кнопку "письмо не пришло", скрывает ее', async () => {
    createComponent({
      isOpen: true,
      contact: BASE_MAIL,
      type: METHODS_TOKEN_VERIFICATION.MAIL,
      tokenId: mockTokenIdSuccessFixture.id,
    })

    const getTokenSpy = jest
      .spyOn(VerificationService, 'getToken')
      .mockResolvedValueOnce(mockTokenIdSuccessFixture.id)
    await findButtonByText(LETTER_NOT_SENT_BTN_TEXT).trigger('click')
    await nextTick()
    await nextTick()
    expect(wrapper.html()).not.toContain(LETTER_NOT_SENT_BTN_TEXT)
    getTokenSpy.mockRestore()
  })

  it('По клику на кнопку "письмо не пришло", показывает ее после окончания таймера', async () => {
    createComponent({
      isOpen: true,
      contact: BASE_MAIL,
      type: METHODS_TOKEN_VERIFICATION.MAIL,
      tokenId: mockTokenIdSuccessFixture.id,
    })

    const getTokenSpy = jest
      .spyOn(VerificationService, 'getToken')
      .mockResolvedValueOnce(mockTokenIdSuccessFixture.id)
    await findButtonByText(LETTER_NOT_SENT_BTN_TEXT).trigger('click')
    await nextTick()
    await nextTick()
    jest.runAllTimers()
    await nextTick()
    await nextTick()
    expect(wrapper.html()).toContain(LETTER_NOT_SENT_BTN_TEXT)
    getTokenSpy.mockRestore()
  })
})
