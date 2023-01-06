import { shallowMount } from '@vue/test-utils'
import SInputPin from '~/components/ui-system/s-input-pin'

describe('~/components/ui-system/s-input-pin', () => {
  let wrapper
  const createComponent = (props) => {
    wrapper = shallowMount(SInputPin, {
      propsData: props,
    })
  }

  afterEach(() => {
    wrapper.destroy()
  })

  it('При вводе меняет значение инпута (отправляет value наверх)', async () => {
    createComponent({})
    const inputs = wrapper.findAll('input').wrappers

    for (const input of inputs) {
      input.element.value = '1'
      await input.trigger('input')
    }
    expect(wrapper.emitted('change-pin')[3][0]).toEqual(['1', '1', '1', '1'])
  })

  it('Отображает изначальное значение инпута', () => {
    createComponent({
      value: [0, 1, 2, 3],
    })
    let result = ''
    const inputs = wrapper.findAll('input').wrappers
    inputs.forEach((el) => {
      result += el.element.value
    })
    expect(result).toBe('0123')
  })
})
