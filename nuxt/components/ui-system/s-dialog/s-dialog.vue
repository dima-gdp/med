<template>
  <transition name="modal">
    <div v-if="model" :class="classDialog()" @click="outsideClick">
      <div :class="`${classComponent}__mask`"></div>
      <div :class="`${classComponent}__wrap`">
        <button v-if="!notClose" :class="`${classComponent}__close-btn`" @click="close">
          <EvaIcon :class="`${classComponent}__close-icon`" name="close-outline" fill="#2E3A59" />
        </button>
        <header :class="`${classComponent}__header`">
          <h3 v-if="!$slots.header" :class="`${classComponent}__title`">
            {{ title }}
          </h3>
          <slot v-else name="header"></slot>
        </header>
        <div :class="`${classComponent}__content`">
          <slot></slot>
        </div>
        <footer v-if="$slots.footer" :class="`${classComponent}__footer`">
          <slot name="footer"></slot>
        </footer>
      </div>
    </div>
  </transition>
</template>

<script>
import { toRef, watch } from '@nuxtjs/composition-api'
import EvaIcon from '@/components/base/eva-icon'
import { useDialog } from '~/components/ui-composables/useDialog'
export default {
  name: 'CustomDialog',
  components: {
    EvaIcon,
  },
  props: {
    value: { type: Boolean, default: false },
    preset: { type: String, default: 'default' },
    title: { type: String, default: '' },
    transition: { type: String, default: 's-dialog' },
    preventClose: { type: Boolean, default: false },
    center: { type: Boolean, default: false },
    fullScreen: { type: Boolean, default: false },
    loading: { type: Boolean, default: false },
    notClose: { type: Boolean, default: false },
    scroll: { type: Boolean, default: false },
  },
  setup(props, ctx) {
    const classComponent = 's-dialog'
    const presetClass = `${classComponent}_${props.preset}`
    const dialogData = useDialog(toRef(props, 'value'), ctx)

    const outsideClick = (evt) => {
      const el = evt.target
      if (!el.closest('.s-dialog__wrap') && !props.preventClose) {
        dialogData.close()
      }
    }
    /**
     * @param {KeyboardEvent} evt
     */
    const escListener = (evt) => {
      if (evt.key === 'Escape' && !props.preventClose) {
        dialogData.close()
      }
    }

    const classDialog = () => {
      return [
        { [`${classComponent}`]: true },
        { [`${classComponent}__${props.preset}`]: true },
        { [`${classComponent}__center`]: props.center },
        { [`${classComponent}__full-screen`]: props.fullScreen },
        { [`${classComponent}__scroll`]: props.scroll },
      ]
    }

    watch(dialogData.model, (value) => {
      if (value) {
        // модалка открыта
        document.body.style.overflow = 'hidden'
        window.addEventListener('keydown', escListener)
      } else {
        document.body.style.overflow = ''
        window.removeEventListener('keydown', escListener)
      }
    })

    return {
      ...dialogData,
      presetClass,
      classComponent,
      outsideClick,
      classDialog,
    }
  },
}
</script>

<style lang="scss">
@import 's-dialog';
</style>
