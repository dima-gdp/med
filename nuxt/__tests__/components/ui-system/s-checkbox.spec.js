import { mount } from '@vue/test-utils'
import SCheckbox from '~/components/ui-system/s-checkbox'

describe('ui-system/s-checkbox', () => {
  const CHECKBOX_DEFAULT_PROPS = {
    value: false,
    disabled: false,
  }
  const checkboxFactory = (propsData = {}) => {
    return mount(SCheckbox, {
      propsData: {
        ...propsData,
      },
    })
  }

  it('s-checkbox отображается', () => {
    const wrapper = checkboxFactory(CHECKBOX_DEFAULT_PROPS)
    expect(wrapper.html()).toMatchSnapshot()
  })

  it('s-checkbox классы компонента при  дефолтных значения', () => {
    const wrapper = checkboxFactory(CHECKBOX_DEFAULT_PROPS)

    expect(wrapper.classes('s-checkbox')).toBe(true)
    expect(wrapper.classes('s-checkbox--checked')).toBe(false)
    expect(wrapper.classes('s-checkbox--disabled')).toBe(false)
  })

  it('s-checkbox при установленном значении disabled добавляется class (s-checkbox--disabled) и атрибут disabled', () => {
    const wrapper = checkboxFactory({ value: false, disabled: true })
    const checkbox = wrapper.find('input')
    expect(wrapper.classes('s-checkbox--disabled')).toBe(true)
    expect(checkbox.attributes('disabled')).toBeTruthy()
  })

  it('s-checkbox при клике изменяется значение на true|false, эммитятся значения, добовляется|убирается class (s-checkbox--checked)', async () => {
    const wrapper = checkboxFactory(CHECKBOX_DEFAULT_PROPS)

    const checkbox = wrapper.find('.s-checkbox')
    await checkbox.trigger('click')
    expect(wrapper.find('input').attributes('value')).toBe('true')
    expect(wrapper.emitted().input).toEqual([[true]])
    expect(wrapper.emitted().change).toEqual([[true]])
    await wrapper.vm.$nextTick()
    expect(wrapper.classes('s-checkbox--checked')).toBe(true)
  })
})
