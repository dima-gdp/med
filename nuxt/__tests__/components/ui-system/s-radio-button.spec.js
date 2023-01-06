import { mount } from '@vue/test-utils'
import VueCompositionAPI, { ref } from '@vue/composition-api'
import Vue from 'vue'
import SRadioButton from '~/components/ui-system/s-radio/s-radio-button'

Vue.use(VueCompositionAPI)

describe('ui-system/s-radio/s-radio-button', () => {
  const RADIO_BUTTON_DEFAULT_PROPS = {
    disabled: false,
    val: 1,
  }
  const RADIO_BUTTON_DEFAULT_PROVIDE = {
    group: ref(1),
  }

  const radioButtonFactory = (propsData, provide = {}) => {
    return mount(SRadioButton, {
      propsData: {
        ...propsData,
      },
      provide: {
        ...provide,
      },
    })
  }

  it('s-radio-button отображается', () => {
    const wrapper = radioButtonFactory(RADIO_BUTTON_DEFAULT_PROPS, RADIO_BUTTON_DEFAULT_PROVIDE)
    expect(wrapper.html()).toMatchSnapshot()
  })

  it('s-radio-button классы компонента при  дефолтных значения', () => {
    const wrapper = radioButtonFactory(RADIO_BUTTON_DEFAULT_PROPS, RADIO_BUTTON_DEFAULT_PROVIDE)

    expect(wrapper.classes('s-radio-button')).toBe(true)
    expect(wrapper.classes('s-radio-button--checked')).toBe(true)
    expect(wrapper.classes('s-radio-button--disabled')).toBe(false)
  })

  it('s-radio-button при переданном параметре disabled добавляется класс s-radio-button--disabled', () => {
    const wrapper = radioButtonFactory({ disabled: true, val: 1 }, RADIO_BUTTON_DEFAULT_PROVIDE)

    expect(wrapper.classes('s-radio-button--disabled')).toBe(true)
  })

  it('s-radio-button если параметр val === group (из inject) добавляется класс s-radio-button--checked', () => {
    const wrapper = radioButtonFactory(RADIO_BUTTON_DEFAULT_PROPS, RADIO_BUTTON_DEFAULT_PROVIDE)

    expect(wrapper.classes('s-radio-button--checked')).toBe(true)
  })

  it('s-radio-group при клике  эммитится событие  input с новым значением', async () => {
    const wrapper = radioButtonFactory(RADIO_BUTTON_DEFAULT_PROPS, RADIO_BUTTON_DEFAULT_PROVIDE)
    await wrapper.trigger('click')
    expect(wrapper.emitted().input).toEqual([[1]])
  })
})
