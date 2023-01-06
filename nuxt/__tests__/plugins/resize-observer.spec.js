import resizeObserver from '@/plugins/resize-observer'
import Vue from 'vue'
import Vuex from 'vuex'
import MatchMediaMock from 'jest-matchmedia-mock'
import { BREAKPOINT_SIZES, BREAKPOINT_NAMES } from '@/utils/constants'

Vue.use(Vuex)

const mockQueryLists = [
  {
    name: BREAKPOINT_NAMES.DESKTOP,
    query: `(min-width: ${BREAKPOINT_SIZES.DESKTOP}px)`,
  },
  {
    name: BREAKPOINT_NAMES.TABLET,
    query: `(max-width: ${BREAKPOINT_SIZES.DESKTOP - 1}px) and (min-width: ${
      BREAKPOINT_SIZES.TABLET
    }px)`,
  },
  {
    name: BREAKPOINT_NAMES.MOBILE,
    query: `(max-width: ${BREAKPOINT_SIZES.TABLET - 1}px)`,
  },
]

describe('@/plugins/resize-observer', () => {
  let matchMedia
  let ctx

  const setProcessServer = (processServer) => {
    Object.defineProperty(process, 'server', {
      writable: true,
      value: processServer,
    })
  }

  const createCtx = () => {
    ctx = {
      store: new Vuex.Store({
        state: {
          currentBreakpoint: '',
        },
        mutations: {
          SET_CURRENT_BREAKPOINT(state, payload) {
            state.currentBreakpoint = payload
          },
        },
      }),
    }
  }

  beforeAll(() => {
    matchMedia = new MatchMediaMock()
  })

  afterEach(() => {
    matchMedia.clear()
  })

  it('Если observer срабатывает на стороне сервера, то в store записываем xl (BREAKPOINT_NAMES.DESKTOP)', () => {
    createCtx()
    setProcessServer(true)
    resizeObserver(ctx)
    expect(ctx.store.state.currentBreakpoint).toBe(BREAKPOINT_NAMES.DESKTOP)
  })

  it('Если observer срабатывает на стороне клиента, то в store записывается начальный breakpoint', () => {
    createCtx()
    setProcessServer(false)
    resizeObserver(ctx)
    matchMedia.useMediaQuery(mockQueryLists[2].query)
    expect(ctx.store.state.currentBreakpoint).toBe(mockQueryLists[2].name)
  })

  it('Если observer срабатывает на стороне клиента, то подписываемся на обновления для всех расширений', () => {
    createCtx()
    setProcessServer(false)
    resizeObserver(ctx)
    matchMedia.useMediaQuery(mockQueryLists[2].query)
    expect(matchMedia.getMediaQueries().length).toBe(mockQueryLists.length)
  })

  it('Если viewport меняется по ширине, то записывается соответствующие значение в store', () => {
    createCtx()
    setProcessServer(false)
    resizeObserver(ctx)
    matchMedia.useMediaQuery(mockQueryLists[1].query)
    expect(ctx.store.state.currentBreakpoint).toBe(mockQueryLists[1].name)
    matchMedia.useMediaQuery(mockQueryLists[0].query)
    expect(ctx.store.state.currentBreakpoint).toBe(mockQueryLists[0].name)
  })
})
