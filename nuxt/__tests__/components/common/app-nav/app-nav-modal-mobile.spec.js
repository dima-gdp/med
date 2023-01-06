import { shallowMount, mount } from '@vue/test-utils'
import { mockPossibleMenuItemsFixture } from '@/api/mocs/api-user-mock'
import AppNavModalMobile from '~/components/common/app-nav/app-nav-modal-mobile'
import flushPromises from '~/utils/flush-promises'

const mockLogout = jest.fn()
const mockRouterPush = jest.fn()
jest.mock('~/domain/services/auth-service/auth-service.js', () =>
  jest.fn().mockImplementation(() => ({
    logout: mockLogout,
  })),
)
function findElementByText({ text, wrapper, selector }) {
  return wrapper.findAll(selector).wrappers.find((w) => w.text() === text)
}

describe('~/components/common/app-nav/app-nav-modal-mobile', () => {
  let wrapper
  const MENU_ITEM_TEXT = 'Расписание'
  const findLinkByText = (text) => wrapper.findAll('a').wrappers.find((w) => w.text() === text)
  const findButtonByText = (text) =>
    wrapper.findAll('button').wrappers.find((w) => w.text() === text)
  const IconCloseMobileMenuStub = {
    template: '<svg>Закрыть</svg>',
  }

  it('Отрисовывает модалку, если передан параметр value: true', () => {
    wrapper = shallowMount(AppNavModalMobile, {
      propsData: {
        value: true,
      },
      stubs: {
        NuxtLink: true,
      },
    })
    expect(wrapper.text()).toContain(MENU_ITEM_TEXT)
  })

  it('Не отрисовывает модалку, если не передан параметр value или value: false', () => {
    wrapper = shallowMount(AppNavModalMobile, {
      propsData: {
        value: false,
      },
      stubs: {
        NuxtLink: true,
      },
    })
    expect(wrapper.text()).toBeFalsy()
  })

  it('Показывает общее меню, если передан параметр content: "menu"', () => {
    wrapper = shallowMount(AppNavModalMobile, {
      propsData: {
        value: true,
        content: 'menu',
      },
      stubs: {
        NuxtLink: true,
      },
    })

    expect(findLinkByText(MENU_ITEM_TEXT).isVisible()).toBe(true)
  })

  it('Не показывает общее меню, если параметр content не равен "menu"', () => {
    wrapper = shallowMount(AppNavModalMobile, {
      propsData: {
        value: true,
        content: 'user',
      },
      stubs: {
        NuxtLink: true,
      },
    })

    expect(findLinkByText(MENU_ITEM_TEXT).isVisible()).toBe(false)
  })

  it('Отрисовывает меню пользователя, если передан параметр userMenu', () => {
    wrapper = shallowMount(AppNavModalMobile, {
      propsData: {
        value: true,
        content: 'user',
        userMenu: mockPossibleMenuItemsFixture,
      },
      stubs: {
        NuxtLink: true,
      },
    })

    expect(wrapper.text()).toContain(mockPossibleMenuItemsFixture[0].title)
  })

  it('Показывает меню пользователя, если передан параметр content: "user" а также userMenu', () => {
    wrapper = shallowMount(AppNavModalMobile, {
      propsData: {
        value: true,
        content: 'user',
        userMenu: mockPossibleMenuItemsFixture,
      },
      stubs: {
        NuxtLink: true,
      },
    })

    expect(findLinkByText(mockPossibleMenuItemsFixture[0].title).isVisible()).toBe(true)
  })

  it('Разлогинивает по нажатию на "Выйти" и возвращает на главную', async () => {
    wrapper = shallowMount(AppNavModalMobile, {
      propsData: {
        value: true,
        content: 'user',
        userMenu: mockPossibleMenuItemsFixture,
      },
      stubs: {
        NuxtLink: true,
      },
      mocks: {
        $router: { push: mockRouterPush },
      },
    })

    const logOutButtonWrapper = findElementByText({
      text: 'Выйти',
      wrapper,
      selector: '.color--kiwi-green',
    })
    logOutButtonWrapper.trigger('click')
    await flushPromises()
    expect(mockRouterPush).toHaveBeenCalledWith({ path: '/' })
    expect(mockLogout).toHaveBeenCalled()
  })

  it('Не показывает меню пользователя, если параметр content не равен "user"', () => {
    wrapper = shallowMount(AppNavModalMobile, {
      propsData: {
        value: true,
        content: 'menu',
        userMenu: mockPossibleMenuItemsFixture,
      },
      stubs: {
        NuxtLink: true,
      },
    })

    expect(findLinkByText(mockPossibleMenuItemsFixture[0].title).isVisible()).toBe(false)
  })

  it('Закрывает модалку по клику на кнопку закрыть', async () => {
    wrapper = shallowMount(AppNavModalMobile, {
      propsData: {
        value: true,
      },
      stubs: {
        IconCloseMobileMenu: IconCloseMobileMenuStub,
        NuxtLink: true,
      },
    })

    await findButtonByText('Закрыть').trigger('click')
    expect(wrapper.emitted('close')).toBeTruthy()
  })

  it('Закрывает модалку по клику вне модалки', () => {
    wrapper = mount(AppNavModalMobile, {
      propsData: {
        value: true,
      },
      stubs: {
        IconCloseMobileMenu: IconCloseMobileMenuStub,
        NuxtLink: true,
      },
    })

    const event = new Event('pointerdown', { bubbles: true })
    document.body.dispatchEvent(event)

    expect(wrapper.emitted('close')).toBeTruthy()
  })
})
