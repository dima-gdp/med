<template>
  <div :class="classRadio" class="s-radio-group__item" @click="onInput">
    <div v-if="!button" :class="`${classComponent}__box`">
      <input :class="`${classComponent}__input`" type="radio" :value="model" :disabled="disabled" />
      <div :class="`${classComponent}__mask`">
        <div v-if="model" :class="`${classComponent}__check`"></div>
      </div>
    </div>
    <label :class="`${classComponent}__label`">
      <slot></slot>
    </label>
  </div>
</template>

<script>
import { inject, computed } from '@nuxtjs/composition-api'
export default {
  name: 'SRadio',
  props: {
    disabled: { type: Boolean, default: false },
    val: { type: [String, Number, Boolean, Function], default: null },
    button: { type: Boolean, default: false },
  },
  setup(props, ctx) {
    const classComponent = 's-radio'
    const group = inject('group')
    let model = group.value

    const classRadio = computed(() => [
      { [`${classComponent}`]: true },
      { [`${classComponent}--checked`]: isChecked() },
      { [`${classComponent}--disabled`]: props.disabled },
    ])

    function onInput() {
      group.value = props.val
      model = props.val
      ctx.emit('input', props.val)
    }

    function isChecked() {
      return group.value === props.val
    }

    return {
      onInput,
      isChecked,

      model,
      group,
      classRadio,
      classComponent,
    }
  },
}
</script>
<style lang="scss">
@import 's-radio';
</style>
