import { shallowMount } from '@vue/test-utils'
import Vue, { nextTick } from 'vue'
import Vuex from 'vuex'
import { SButton, SSpin } from '~/components/ui-system'
import List from '~/pages/orders/list'
import AppOrderCard from '~/components/common/app-order-card'
import { mockOrdersListFixture } from '~/api/mocs/api-order-mock'
import OrderService from '~/domain/services/order-service'
import { mockCreatePaymentFixture } from '~/api/mocs/api-payment-mock'
import flushPromises from '~/utils/flush-promises'

Vue.use(Vuex)

const mockRouterPush = jest.fn()
const mockCreatePayment = jest.fn().mockResolvedValue(mockCreatePaymentFixture)

jest.mock('~/domain/composables/use-payment', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    createPayment: mockCreatePayment,
  })),
}))

const LOAD_MORE_BTN_TEXT = 'Показать больше заказов'

describe('~/pages/orders/list', () => {
  Object.defineProperty(window, 'location', {
    value: {
      href: '',
    },
    writable: true,
  })

  const findButtonByText = (text) =>
    wrapper.findAll('button').wrappers.find((w) => w.text() === text)

  const blockWithBtnAndPreloader = () => wrapper.find('.order-list-page__btn-block')

  let wrapper
  let store
  const createComponent = (isLoggedIn = true) => {
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

    wrapper = shallowMount(List, {
      store,
      stubs: { 'nuxt-link': true, SButton, SSpin },
      mocks: {
        $router: { push: mockRouterPush },
        $auth: { isLoggedIn: true },
      },
    })
  }

  afterEach(() => {
    wrapper.destroy()
    mockCreatePayment.mockClear()
  })

  it('Перед первой загрузкой страницы показываем прелоадер', async () => {
    jest
      .spyOn(OrderService, 'getOrdersList')
      .mockResolvedValue(mockOrdersListFixture.initialFormatted)
    createComponent()
    await nextTick()

    expect(wrapper.findComponent(SSpin).isVisible()).toBe(true)
  })

  it('После загрузки контента, убираем прелоадер', async () => {
    jest
      .spyOn(OrderService, 'getOrdersList')
      .mockResolvedValue(mockOrdersListFixture.initialFormatted)
    createComponent()
    await flushPromises()

    expect(wrapper.findComponent(SSpin).exists()).toBe(false)
  })

  it('Если есть заказы, выводим список заказов', async () => {
    jest
      .spyOn(OrderService, 'getOrdersList')
      .mockResolvedValue(mockOrdersListFixture.initialFormatted)
    createComponent()

    await flushPromises()

    const ordersCardLength = wrapper.findAllComponents(AppOrderCard).length

    expect(ordersCardLength).toBe(mockOrdersListFixture.initial.orders.length)
  })

  it('Если заказов больше чем на одну страницу, выводим кнопку показать больше', async () => {
    jest
      .spyOn(OrderService, 'getOrdersList')
      .mockResolvedValue(mockOrdersListFixture.initialFormatted)
    createComponent()

    await flushPromises()

    expect(findButtonByText(LOAD_MORE_BTN_TEXT).isVisible()).toBe(true)
  })

  it('Если заказов меньше чем на одну страницу, не выводим блок с прелоадером и кнопкой показать больше', async () => {
    jest.spyOn(OrderService, 'getOrdersList').mockResolvedValue(mockOrdersListFixture.empty)
    createComponent()
    await flushPromises()

    expect(blockWithBtnAndPreloader().exists()).toBe(false)
  })

  it('По клику на кнопку "показать больше" загружаем еще заказы', async () => {
    jest
      .spyOn(OrderService, 'getOrdersList')
      .mockResolvedValue(mockOrdersListFixture.initialFormatted)
    createComponent()

    await flushPromises()
    jest
      .spyOn(OrderService, 'getOrdersList')
      .mockResolvedValue(mockOrdersListFixture.secondFormatted)
    await findButtonByText(LOAD_MORE_BTN_TEXT).trigger('click')
    await flushPromises()
    const ordersCardLength = wrapper.findAllComponents(AppOrderCard).length
    expect(ordersCardLength).toBe(
      mockOrdersListFixture.initial.orders.length + mockOrdersListFixture.second.orders.length,
    )
  })

  it('По клику на кнопку "показать больше" отображаем прелоадер', async () => {
    jest
      .spyOn(OrderService, 'getOrdersList')
      .mockResolvedValue(mockOrdersListFixture.initialFormatted)
    createComponent()

    await flushPromises()
    jest
      .spyOn(OrderService, 'getOrdersList')
      .mockResolvedValue(mockOrdersListFixture.secondFormatted)
    await findButtonByText(LOAD_MORE_BTN_TEXT).trigger('click')
    expect(wrapper.findComponent(SSpin).isVisible()).toBe(true)
  })

  it('Передает объект заказа в дочерний компонент AppOrderCard', async () => {
    jest
      .spyOn(OrderService, 'getOrdersList')
      .mockResolvedValue(mockOrdersListFixture.initialFormatted)
    createComponent()

    await flushPromises()

    const orderCardFirst = wrapper.findAllComponents(AppOrderCard).at(0)

    expect(orderCardFirst.props().order).toEqual(
      mockOrdersListFixture.initialFormatted.ordersList[0].list[0],
    )
  })

  it('При нажатии на кнопку "оплатить" в дочернем компоненте AppOrderCard, создает платеж', async () => {
    jest
      .spyOn(OrderService, 'getOrdersList')
      .mockResolvedValue(mockOrdersListFixture.initialFormatted)
    createComponent()

    await flushPromises()

    const orderCardFirst = wrapper.findAllComponents(AppOrderCard).at(0)

    orderCardFirst.vm.$emit('create-payment')

    expect(mockCreatePayment).toHaveBeenCalled()
  })

  it('При нажатии на кнопку "оплатить" в дочернем компоненте AppOrderCard, переходит на страницу оплаты', async () => {
    jest
      .spyOn(OrderService, 'getOrdersList')
      .mockResolvedValue(mockOrdersListFixture.initialFormatted)

    createComponent()

    await flushPromises()

    const orderCardFirst = wrapper.findAllComponents(AppOrderCard).at(0)

    orderCardFirst.vm.$emit('create-payment')

    expect(window.location.href).toBe(mockCreatePaymentFixture.data.confirmationUrl)
  })
})
