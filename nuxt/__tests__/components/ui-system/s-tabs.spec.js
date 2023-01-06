import { mount } from '@vue/test-utils'
import { STabs } from '~/components/ui-system/s-tabs'

describe('ui-system/s-tabs', () => {
  it('s-tabs отображается', () => {
    const wrapper = mount(STabs)
    expect(wrapper.html()).toMatchSnapshot()
  })
})
