<template>
  <div :class="classList">
    <div :class="`${classDefault}__header`">
      <span
        :mouseover="mouseover(name)"
        :mouseout="mouseover(name)"
        :class="`${classDefault}__title`"
        @click="toggle(name)"
      >
        <slot name="header"></slot>
        <EvaIcon
          v-if="!$slots.icon && !arrow"
          :class="`${classDefault}__icon`"
          name="chevron-down-outline"
        ></EvaIcon>
        <slot v-else name="icon"></slot>
      </span>
    </div>
    <collapse-transition>
      <div v-show="isShown(name)" :class="`${classDefault}__body`">
        <slot></slot>
      </div>
    </collapse-transition>
  </div>
</template>
<script>
import { ref, inject, computed } from '@nuxtjs/composition-api'
import collapseTransition from '@/assets/vendors/collapse-transition/collapse-transition'
import EvaIcon from '~/components/base/eva-icon'

export default {
  components: {
    EvaIcon,
    collapseTransition,
  },
  props: {
    center: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
    notArrow: { type: Boolean, default: false },
    name: { type: String, default: '' },
  },
  setup(props) {
    const opened = inject('opened')
    const collapse = inject('collapse')
    const classDefault = 's-collapse-item'
    const arrow = ref(props.notArrow)
    const openHover = collapse.openHover

    const classList = computed(() => [
      { [`${classDefault}`]: true },
      { [`${classDefault}--${collapse.preset}`]: true },
      { [`${classDefault}--center`]: props.center },
      { [`${classDefault}--opened`]: opened.value.includes(props.name) },
      { [`${classDefault}--disabled`]: props.disabled },
    ])

    function toggle(name) {
      if (isShown(name)) {
        hide(name)
      } else {
        show(name)
      }
    }

    function show(name) {
      if (!openHover) {
        showAction(name)
      }
    }

    function showAction(name) {
      if (!collapse.accordion) {
        opened.value.push(name)
      } else {
        opened.value = []
        opened.value.push(name)
      }
    }

    function hide(name) {
      if (!openHover) {
        opened.value = opened.value.filter((n) => n !== name)
      }
    }

    function isShown(name) {
      return opened.value.includes(name)
    }

    function mouseover(name) {
      if (openHover) {
        showAction(name)
      }
    }

    function mouseout(name) {
      if (openHover) {
        opened.value = opened.value.filter((n) => n !== name)
      }
    }

    return {
      classDefault,
      arrow,
      classList,
      toggle,
      isShown,
      mouseover,
      mouseout,
    }
  },
}
</script>
