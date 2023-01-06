import { Ref, SetupContext } from '@nuxtjs/composition-api'
export function useDialog(value: Ref<Boolean>, ctx: SetupContext) {
  const model = value

  function close() {
    ctx.emit('input', false)
  }

  return {
    model,
    close,
  }
}
