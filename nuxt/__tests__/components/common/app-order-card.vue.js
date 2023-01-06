import { mount } from '@vue/test-utils'
import AppOrderCard from '~/components/common/app-order-card'
import { mockOrdersListFixture } from '~/api/mocs/api-order-mock'

describe('~/components/common/app-order-card', () => {
  let wrapper

  const createComponent = (propsData) => {
    wrapper = mount(AppOrderCard, {
      propsData,
    })
  }

  afterEach(() => {
    wrapper.destroy()
  })

  it('Если тип заказа модуль', () => {
    createComponent({
      order: mockOrdersListFixture.initialFormatted.ordersList[0].list[0],
    })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('Если тип заказа итерация курса', () => {
    createComponent({
      order: mockOrdersListFixture.initialFormatted.ordersList[0].list[9],
    })

    expect(wrapper.html()).toMatchSnapshot()
  })
})
