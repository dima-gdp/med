import { mount } from '@vue/test-utils'
import SInput from '~/components/ui-system/s-input'

describe('ui-system/s-input', () => {
  const INPUT_DEFAULT_PROPS = {
    value: '',
    placeholder: '',
    disabled: false,
    appendIcon: '',
    type: 'text',
    autocomplete: 'off',
    name: '',
    readonly: false,
  }

  const inputFactory = (propsData = {}) => {
    return mount(SInput, {
      propsData: {
        ...propsData,
      },
      attachTo: document.body,
    })
  }

  it('s-input отображается', () => {
    const wrapper = inputFactory(INPUT_DEFAULT_PROPS)
    expect(wrapper.html()).toMatchSnapshot()
  })

  it('s-input дефолтные значения', () => {
    const wrapper = inputFactory(INPUT_DEFAULT_PROPS)
    const input = wrapper.find('input')

    expect(wrapper.classes('s-input')).toBe(true)
    expect(input.attributes('autocomplete')).toBe('off')
    expect(input.attributes('type')).toBe('text')
    expect(input.attributes('name')).toBe('')
    expect(input.attributes('placeholder')).toBe('')
  })

  it('s-input при установленном значении disabled добавляется class (s-input--disabled) и атрибут disabled', () => {
    const wrapper = inputFactory({ value: '', disabled: true })
    const input = wrapper.find('input')

    expect(wrapper.classes('s-input--disabled')).toBe(true)
    expect(input.attributes('disabled')).toBeTruthy()
  })

  it('s-input при вводе значения эммитит событие input с введенымм значением', async () => {
    const wrapper = inputFactory(INPUT_DEFAULT_PROPS)
    const input = wrapper.find('input')
    await input.trigger('input')

    expect(wrapper.emitted().input).toEqual([['']])
  })

  it('s-input при focus эммитит событие focus со значением true ', () => {
    const wrapper = inputFactory(INPUT_DEFAULT_PROPS)
    const input = wrapper.find('input')
    input.trigger('focus')
    expect(wrapper.emitted().focus).toEqual([[true]])
  })

  it('s-input при blur эммитит событие blur со значением false', () => {
    const wrapper = inputFactory(INPUT_DEFAULT_PROPS)
    const input = wrapper.find('input')
    input.trigger('blur')
    expect(wrapper.emitted().blur).toEqual([[false]])
  })
})
