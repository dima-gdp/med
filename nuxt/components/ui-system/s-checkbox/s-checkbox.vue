<template>
  <div class="s-checkbox" :class="classCheckbox" @click="onInput">
    <div :class="`${classComponent}__box`">
      <input
        :class="`${classComponent}__input`"
        type="checkbox"
        :value="model"
        :disabled="disabled"
      />
      <div :class="`${classComponent}__mask`">
        <IconCheckbox v-if="model" :class="`${classComponent}__check`"></IconCheckbox>
      </div>
    </div>
    <label class="visually-hidden" for="">
      {{ label }}
    </label>
  </div>
</template>
<script>
import { IconCheckbox } from '~/components/icons/index'

export default {
  name: 'SCheckbox',
  components: {
    IconCheckbox,
  },
  props: {
    value: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
    label: { type: String, default: '' },
  },
  data() {
    return {
      classComponent: 's-checkbox',
      model: null,
    }
  },
  computed: {
    classCheckbox() {
      return [
        { [`${this.classComponent}--checked`]: this.model },
        { [`${this.classComponent}--disabled`]: this.disabled },
      ]
    },
  },
  watch: {
    value(val) {
      this.model = val
      this.$emit('input', this.model)
      this.$emit('change', this.model)
    },
  },
  created() {
    this.model = this.value
  },
  methods: {
    onInput() {
      this.model = !this.model
      this.$emit('input', this.model)
      this.$emit('change', this.model)
    },
  },
}
</script>
<style lang="scss">
@import 's-checkbox';
</style>
