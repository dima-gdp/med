import { shallowMount } from '@vue/test-utils'
import SButton from '~/components/ui-system/s-button'

describe('ui-system/s-button', () => {
  it('ui-button отображается', () => {
    const wrapper = shallowMount(SButton)
    expect(wrapper.html()).toMatchSnapshot()
  })

  it('логировать ошибку, если указать iconName, но не указать icon отличное от "no"', () => {
    const fakeConsoleError = jest.spyOn(console, 'error')

    shallowMount(SButton, {
      propsData: {
        icon: 'no',
        iconName: 'test-name',
      },
    })

    expect(fakeConsoleError).toHaveBeenCalled()
  })
})
