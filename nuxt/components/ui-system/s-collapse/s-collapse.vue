<template>
  <div class="s-collapse">
    <slot></slot>
  </div>
</template>
<script>
import { provide, ref, watch } from '@nuxtjs/composition-api'

export default {
  props: {
    accordion: { type: Boolean, default: false },
    preset: { type: String, default: 'default' },
    openHover: { type: Boolean, default: false },
    value: { type: [Array, String, Number], default: () => [] },
  },
  setup(props, { emit }) {
    const opened = ref(props.value)

    provide('opened', opened)

    provide('collapse', props)

    watch(opened, (value) => {
      emit('change', value)
    })

    return {
      opened,
    }
  },
}
</script>
<style lang="scss">
@import 's-collapse';
</style>
