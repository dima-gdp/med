import { shallowMount, createLocalVue } from '@vue/test-utils'
import { mockUserDataFixture } from '@/api/mocs/api-user-mock'
import Vuex from 'vuex'
import { getters as realUserModuleGetters } from '@/store/user'
import SAlert from '@/components/ui-system/s-alert'
import AppStaticMessages from '@/components/base/app-static-messages'

const localVue = createLocalVue()
localVue.use(Vuex)

describe('@/components/base/app-static-messages', () => {
  let store
  let state

  beforeEach(() => {
    state = {
      userData: {
        mockUserDataFixture,
        profile: {
          ...mockUserDataFixture.profile,
          companyId: null,
        },
      },
    }

    store = new Vuex.Store({
      modules: {
        user: {
          state,
          getters: realUserModuleGetters,
          namespaced: true,
        },
      },
    })
  })

  it('Отображается только сообщение об отсутствии организации', () => {
    const wrapper = shallowMount(AppStaticMessages, {
      store,
      localVue,
      stubs: {
        SAlert,
      },
      mocks: {
        $auth: {
          isAdminAsUser: false,
        },
      },
    })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('Отображается сообщение об заходе под админом и об отсутствии организации', () => {
    const wrapper = shallowMount(AppStaticMessages, {
      store,
      localVue,
      stubs: {
        SAlert,
      },
      mocks: {
        $auth: {
          fromUserId: true,
        },
      },
    })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('Закрытие сообщения при клике на кнопку его закрытия', async () => {
    const wrapper = shallowMount(AppStaticMessages, {
      store,
      localVue,
      stubs: {
        SAlert,
      },
      mocks: {
        $auth: {
          isAdminAsUser: false,
        },
      },
    })
    const alert = wrapper.findComponent(SAlert)

    expect(alert.classes()).toEqual(expect.arrayContaining(['company-alert']))
    expect(alert.exists()).toBe(true)

    await alert.vm.$emit('close')

    expect(alert.exists()).toBe(false)
  })
})

describe('@/components/base/app-static-message', () => {
  let store
  let state

  beforeEach(() => {
    state = {
      userData: {
        profile: {},
      },
    }

    store = new Vuex.Store({
      modules: {
        user: {
          state,
          getters: realUserModuleGetters,
          namespaced: true,
        },
      },
    })
  })

  it('Не отображать сообщение, если данных пользователя нету', () => {
    const wrapper = shallowMount(AppStaticMessages, {
      store,
      localVue,
      stubs: {
        SAlert,
      },
      mocks: {
        $auth: {
          isAdminAsUser: false,
        },
      },
    })

    const alert = wrapper.findComponent(SAlert)
    expect(alert.exists()).toBe(false)
  })
})
