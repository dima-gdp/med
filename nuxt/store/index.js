export const state = () => ({
  currentBreakpoint: '',
})
export const mutations = {
  SET_CURRENT_BREAKPOINT(state, payload) {
    state.currentBreakpoint = payload
  },
}
