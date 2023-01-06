<template>
  <div :class="classList">
    <input
      ref="inputElement"
      :value="model"
      :autocomplete="autocomplete"
      :class="`${classDefault}__input t-p`"
      :type="inputType"
      :readonly="readonly"
      :name="name"
      :placeholder="placeholder"
      :disabled="disabled"
      @input="onInput"
      @focus="onFocus"
      @blur="onBlur"
    />
    <div v-if="appendIcon.length > 0" :class="`${classDefault}__append-icon`">
      <EvaIcon :class="`${classDefault}__icon`" :name="appendIcon" />
    </div>
  </div>
</template>
<script>
import EvaIcon from '~/components/base/eva-icon'

export default {
  components: {
    EvaIcon,
  },
  props: {
    value: { type: String, default: '' },
    placeholder: { type: String, default: '' },
    disabled: { type: Boolean, default: false },
    appendIcon: { type: String, default: '' },
    type: { type: String, default: 'text' },
    error: { type: Boolean, default: false },
    autocomplete: { type: String, default: 'off' },
    name: { type: String, default: '' },
    readonly: { type: Boolean, default: false },
  },
  data() {
    return {
      classDefault: 's-input',
      model: '',
      isFocused: false,
      inputType: null,
    }
  },
  computed: {
    classList() {
      return [
        { [`${this.classDefault}`]: true },
        { [`${this.classDefault}--disabled`]: this.disabled },
        { [`${this.classDefault}--append-icon`]: this.appendIcon.length > 0 },
        { [`${this.classDefault}--error`]: this.error },
      ]
    },
  },
  watch: {
    value(val) {
      this.model = val
      this.$emit('input', val)
    },
  },
  created() {
    this.model = this.value
    this.inputType = this.type
  },
  methods: {
    onInput(e) {
      this.model = e.target.value
      this.$emit('input', this.model)
      this.$emit('change', e)
    },
    onFocus() {
      if (this.$refs.inputElement) {
        this.isFocused = true
        this.$refs.inputElement.focus()
        this.$emit('focus', this.isFocused)
      }
    },
    onBlur() {
      if (this.$refs.inputElement) {
        this.isFocused = false
        this.$refs.inputElement.blur()
        this.$emit('blur', this.isFocused)
      }
    },
  },
}
</script>
<style lang="scss">
@import 's-input';
</style>
