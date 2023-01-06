import { mount } from '@vue/test-utils'
import VueCompositionAPI, { ref } from '@vue/composition-api'
import Vue from 'vue'
import SRadio from '~/components/ui-system/s-radio/s-radio'

Vue.use(VueCompositionAPI)

describe('ui-system/s-radio/s-radio-button', () => {
  const RADIO_BUTTON_DEFAULT_PROPS = {
    disabled: false,
    val: 1,
  }
  const RADIO_BUTTON_DEFAULT_PROVIDE = {
    group: ref(1),
  }

  const radioFactory = (propsData, provide = {}) => {
    return mount(SRadio, {
      propsData: {
        ...propsData,
      },
      provide: {
        ...provide,
      },
    })
  }

  it('s-radio отображается', () => {
    const wrapper = radioFactory(RADIO_BUTTON_DEFAULT_PROPS, RADIO_BUTTON_DEFAULT_PROVIDE)
    expect(wrapper.html()).toMatchSnapshot()
  })

  it('s-radio классы компонента при  дефолтных значения', () => {
    const wrapper = radioFactory(RADIO_BUTTON_DEFAULT_PROPS, RADIO_BUTTON_DEFAULT_PROVIDE)

    expect(wrapper.classes('s-radio')).toBe(true)
    expect(wrapper.classes('s-radio--checked')).toBe(true)
    expect(wrapper.classes('s-radio--disabled')).toBe(false)
  })

  it('s-radio при переданном параметре disabled добавляется класс s-radio--disabled', () => {
    const wrapper = radioFactory({ disabled: true, val: 1 }, RADIO_BUTTON_DEFAULT_PROVIDE)

    expect(wrapper.classes('s-radio--disabled')).toBe(true)
  })

  it('s-radio если параметр val === group (из inject) добавляется класс s-radio--checked', () => {
    const wrapper = radioFactory(RADIO_BUTTON_DEFAULT_PROPS, RADIO_BUTTON_DEFAULT_PROVIDE)

    expect(wrapper.classes('s-radio--checked')).toBe(true)
  })

  it('s-radio при клике  эммитится событие  input с новым значением', async () => {
    const wrapper = radioFactory(RADIO_BUTTON_DEFAULT_PROPS, RADIO_BUTTON_DEFAULT_PROVIDE)
    await wrapper.trigger('click')
    expect(wrapper.emitted().input).toEqual([[1]])
  })
})
