<template>
  <div
    ref="menuElement"
    class="s-menu"
    :class="{ 's-menu--open': isShown }"
    @mouseenter="toggleVisibility"
    @touchstart="toggleVisibility"
    @mouseleave="toggleVisibility"
    @blur="toggleVisibility"
    @focus="toggleVisibility"
  >
    <span ref="targetElement" class="s-menu__head" :class="{ 's-menu__head--opened': isShown }">
      <span ref="headElement">
        <slot name="head"></slot>
      </span>
      <EvaIcon
        v-if="icon"
        name="chevron-down-outline"
        class="s-menu__icon"
        :class="{ 's-menu__icon--opened': isShown }"
      />
    </span>
    <div
      v-show="isShown"
      ref="popperElement"
      :class="{ 'dropdown-fade-in': isShown }"
      class="s-menu__content-wrapper"
    >
      <ul class="s-menu__content t-dropdown-m">
        <slot></slot>
      </ul>
    </div>
  </div>
</template>

<script>
import { ref } from '@nuxtjs/composition-api'
import { onClickOutside } from '@vueuse/core'
import EvaIcon from '@/components/base/eva-icon'
import useDropdown, { widthAsReferenceModifier } from '~/components/ui-composables/useDropdown'

export default {
  components: {
    EvaIcon,
  },
  props: {
    icon: { type: Boolean, default: true },
    placement: { type: String, default: 'bottom-start' },
    fullWidth: { type: Boolean, default: true },
  },
  setup(props, { slots }) {
    const targetElement = ref(null)
    const popperElement = ref(null)
    const headElement = ref(null)
    const menuElement = ref(null)

    const popperProps = {
      targetElement,
      popperElement,
      popperOptions: {
        placement: props.placement,
        modifiers: [isFullWidth()],
        strategy: 'absolute',
      },
    }

    const dropDown = useDropdown(popperProps)

    function isFullWidth() {
      return props.fullWidth && slots.default ? widthAsReferenceModifier() : ''
    }

    onClickOutside(menuElement, (e) => {
      if (e.target !== targetElement.value) {
        dropDown.hide()
      }
    })

    return {
      targetElement,
      popperElement,
      menuElement,
      headElement,
      isShown: dropDown.isShown,

      hide: dropDown.hide,
      show: dropDown.show,
      toggleVisibility: dropDown.toggleVisibility,
    }
  },
}
</script>

<style lang="scss">
@import 's-menu';
</style>
