import { BREAKPOINT_SIZES, BREAKPOINT_NAMES } from '@/utils/constants'

export default function (ctx) {
  if (process.server) {
    ctx.store.commit('SET_CURRENT_BREAKPOINT', BREAKPOINT_NAMES.DESKTOP)
    return
  }

  const queryLists = [
    {
      name: BREAKPOINT_NAMES.DESKTOP,
      list: window.matchMedia(`(min-width: ${BREAKPOINT_SIZES.DESKTOP}px)`),
    },
    {
      name: BREAKPOINT_NAMES.TABLET,
      list: window.matchMedia(
        `(max-width: ${BREAKPOINT_SIZES.DESKTOP - 1}px) and (min-width: ${
          BREAKPOINT_SIZES.TABLET
        }px)`,
      ),
    },
    {
      name: BREAKPOINT_NAMES.MOBILE,
      list: window.matchMedia(`(max-width: ${BREAKPOINT_SIZES.TABLET - 1}px)`),
    },
  ]

  // определить начальный брейкпоинт и подписаться на обновления
  queryLists.forEach((queryList) => {
    if (queryList.list.matches) {
      ctx.store.commit('SET_CURRENT_BREAKPOINT', queryList.name)
    }

    const cb = (event) => {
      if (event.matches) {
        ctx.store.commit('SET_CURRENT_BREAKPOINT', queryList.name)
      }
    }

    if (typeof queryList.list?.addEventListener === 'function') {
      queryList.list?.addEventListener('change', cb)
    } else {
      queryList.list?.addListener(cb)
    }
  })
}
