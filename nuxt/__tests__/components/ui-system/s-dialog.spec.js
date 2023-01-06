import { shallowMount } from '@vue/test-utils'
import SDialog from '~/components/ui-system/s-dialog'
// todo: протестировать фичи clickOutside, закрытия по esc, отображения про разных props
describe('ui-system/s-dialog', () => {
  const dialogFactory = (propsData = {}) => {
    return shallowMount(SDialog, {
      props: {
        ...propsData,
      },
    })
  }

  it('ui-dialog отображается', () => {
    const wrapper = dialogFactory({ value: true })
    expect(wrapper.html()).toMatchSnapshot()
  })
})
