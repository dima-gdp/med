<template>
  <div class="s-input-pin" :class="{ 's-input-pin--compressed': compressed }">
    <input
      v-for="(_, idx) in pin"
      :key="idx"
      ref="input-pin"
      :value="pin[idx]"
      type="number"
      maxlength="1"
      class="s-input-pin__item"
      @input="updatePin($event, idx)"
    />
  </div>
</template>
<script>
export default {
  model: { prop: 'value', event: 'change-pin' },
  props: {
    value: { type: Array, default: () => [] },
    compressed: { type: Boolean, default: false },
    numbersLength: { type: Number, default: 4 },
  },
  computed: {
    pin() {
      if (!this.value.length) {
        const initialState = []
        for (let i = 0; i < this.numbersLength; i++) {
          initialState.push('')
        }
        return initialState
      } else {
        return this.value
      }
    },
  },
  mounted() {
    const inputs = this.$refs['input-pin']
    inputs.forEach((input, idx) => {
      if (idx === this.numbersLength - 1) {
        return
      }
      input.oninput = (ev) => {
        if (ev.target.value) {
          const el = inputs[idx + 1]
          el.focus()
          input.oninput = null
        }
      }
    })
  },
  beforeDestroy() {
    this.$refs['input-pin'].forEach((input, idx) => {
      if (idx === this.numbersLength - 1) {
        return
      }
      input.oninput = null
    })
  },
  methods: {
    updatePin(ev, idx) {
      const newPin = this.pin
      newPin[idx] = ev.target.value
      this.$emit('change-pin', newPin)
    },
  },
}
</script>
<style lang="scss">
@import 's-input-pin';
</style>
