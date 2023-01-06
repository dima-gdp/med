import { shallowMount } from '@vue/test-utils'
import AppSkeletonRectangle from '~/components/base/app-sceletons/app-skeleton-rectangle'

describe('@/components/common/app-nav/app-nav-login-button.vue', () => {
  let wrapper

  it('Компонент AppSkeletonRectangle корректно отображается', () => {
    wrapper = shallowMount(AppSkeletonRectangle, {
      propsData: {
        width: '200px',
        height: '50px',
        color: '#D1DCE2',
      },
    })

    expect(wrapper.html()).toMatchInlineSnapshot(
      `<span class="skeleton-box" style="width: 200px; height: 50px; background-color: rgb(209, 220, 226);"></span>`,
    )
  })
})
