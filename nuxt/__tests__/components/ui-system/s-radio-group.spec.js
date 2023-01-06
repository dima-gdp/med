import { mount } from '@vue/test-utils'
import VueCompositionAPI from '@vue/composition-api'
import Vue from 'vue'
import SRadioGroup from '~/components/ui-system/s-radio/s-radio-group'

Vue.use(VueCompositionAPI)

describe('ui-system/s-radio/s-radio-group', () => {
  const RADIO_GROUP_DEFAULT_PROPS = {
    value: 0,
    column: false,
  }
  const radioGroupFactory = (propsData = {}) => {
    return mount(SRadioGroup, {
      propsData: {
        ...propsData,
      },
    })
  }

  it('s-radio-group отображается', () => {
    const wrapper = radioGroupFactory(RADIO_GROUP_DEFAULT_PROPS)
    expect(wrapper.html()).toMatchSnapshot()
  })

  it('s-radio-group классы компонента при  дефолтных значения', () => {
    const wrapper = radioGroupFactory(RADIO_GROUP_DEFAULT_PROPS)

    expect(wrapper.classes('s-radio-group')).toBe(true)
    expect(wrapper.classes('s-radio-group--column')).toBe(false)
  })

  it('s-radio-group при добавлении параметра column добавится class s-radio-group--column', () => {
    const wrapper = radioGroupFactory({
      value: 0,
      column: true,
    })
    expect(wrapper.classes('s-radio-group--column')).toBe(true)
  })

  it('s-radio-group при изменении параметра value эммитится событие  input с новым значением', async () => {
    const wrapper = radioGroupFactory({ value: 0, column: true })
    await wrapper.setProps({ value: 1, column: false })
    expect(wrapper.emitted().input).toEqual([[1]])
  })
})
