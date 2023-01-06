import { mount } from '@vue/test-utils'
import EvaIcon from '~/components/base/eva-icon'

describe('base/eva-icon', () => {
  it('Рендерит иконку с правильным именем класса', () => {
    const ICON_NAME = 'test-name'
    const wrapper = mount(EvaIcon, {
      propsData: {
        name: ICON_NAME,
      },
    })

    expect(wrapper.classes()).toContain('eva-' + ICON_NAME)
  })
})
