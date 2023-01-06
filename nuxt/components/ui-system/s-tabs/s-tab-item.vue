<template>
  <div v-if="isActive">
    <slot></slot>
  </div>
</template>

<script>
import { inject, ref, watch, onMounted } from '@nuxtjs/composition-api'
export default {
  name: 'STabItem',
  props: {
    title: { type: String, default: '' },
  },
  setup() {
    const index = ref(0)
    const isActive = ref(false)

    const tabs = inject('TabsProvider')

    watch(
      () => tabs.selected,
      () => {
        isActive.value = index.value === tabs.selected
      },
    )
    onMounted(() => {
      index.value = tabs.count
      tabs.count++
      isActive.value = index.value === tabs.selected
    })

    return {
      index,
      isActive,
    }
  },
}
</script>
<style lang="scss">
@import 's-tab-item';
</style>
