<template>
  <div :class="classRadio" class="s-radio-group__item" @click="onInput">
    <label :class="`${classComponent}__label`">
      <slot></slot>
    </label>
  </div>
</template>

<script>
import { inject, computed } from '@vue/composition-api'
export default {
  name: 'SRadioButton',
  props: {
    disabled: { type: Boolean, default: false },
    val: { type: [String, Number, Boolean, Function], default: null },
  },
  setup(props, ctx) {
    const classComponent = 's-radio-button'
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
