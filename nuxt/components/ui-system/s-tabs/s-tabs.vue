<template>
  <div :class="classTabs">
    <div :class="`${classComponent}__nav`">
      <ul :class="`${classComponent}__nav-list`">
        <li
          v-for="(tab, index) in tabs"
          :key="index"
          class="sp-tabs"
          :class="classTabItem(index)"
          @click="selectTab(index)"
        >
          {{ tab.componentInstance.title }}
        </li>
      </ul>
    </div>
    <div :class="`${classComponent}__content`">
      <slot></slot>
    </div>
  </div>
</template>
<script>
import { reactive, provide, toRefs, onMounted, computed, watch } from '@nuxtjs/composition-api'
export default {
  name: 'STabs',

  props: {
    value: { type: Number, default: 0 },
  },

  setup(props, ctx) {
    const classComponent = 's-tabs'

    const state = reactive({
      selected: 0,
      tabs: [],
      count: 0,
    })

    provide('TabsProvider', state)

    watch(() => props.value, (val) => {
      state.selected = val
    })

    const classTabs = computed(() => [
      { [`${classComponent}`]: true },
      { [`${classComponent}_checked`]: props.value },
      { [`${classComponent}--disabled`]: props.disabled },
    ])

    const classTabItem = (index) => {
      return [
        { [`${classComponent}__nav-item`]: true },
        { [`${classComponent}__nav-item--active`]: index === state.selected },
      ]
    }

    const selectTab = (i) => {
      ctx.emit('input', i)
    }

    onMounted(() => {
      if (ctx.slots.default) {
        state.tabs = ctx.slots
          .default()
          .filter((child) => child.componentOptions?.tag === 'STabItem')
      }
    })

    return {
      ...toRefs(state),
      classComponent,
      classTabs,
      classTabItem,
      selectTab,
    }
  },
}
</script>
<style lang="scss">
@import 's-tabs';
</style>
