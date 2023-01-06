<template>
  <div class="s-radio-group" :class="classRadioGroup" role="group" aria-label="radio-group">
    <slot></slot>
  </div>
</template>
<script>
import { provide, ref, watch, computed } from '@nuxtjs/composition-api'
export default {
  props: {
    value: { type: [Array, String, Number, Boolean], default: () => [] },
    column: { type: Boolean, default: false },
  },
  setup(props, ctx) {
    const classComponent = 's-radio-group'
    const group = ref(props.value)

    provide('group', group)

    watch(group, (value) => {
      ctx.emit('input', value)
    })

    watch(
      () => props.value,
      (value) => {
        group.value = value
      },
    )

    const classRadioGroup = computed(() => [{ [`${classComponent}--column`]: props.column }])

    return {
      group,
      classRadioGroup,
    }
  },
}
</script>
