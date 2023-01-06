<template>
  <div>
    <div
      class="s-alert"
      :class="[
        `s-alert--${type}`,
        `${icon ? '' : 's-alert--t-no-icon'}`,
        `${rounded ? 's-alert--rounded' : ''}`,
      ]"
    >
      <EvaIcon v-if="icon" :name="iconName" class="s-alert__icon"> </EvaIcon>
      <div class="s-alert__message sp-tips">
        <slot></slot>
      </div>
      <EvaIcon v-if="closable" name="close-outline" class="s-alert__close" @click="$emit('close')">
      </EvaIcon>
    </div>
  </div>
</template>

<script>
import EvaIcon from '~/components/base/eva-icon'

const STATUSES = {
  SUCCESS: {
    name: 'success',
    icon: 'checkmark-circle-outline',
  },
  WARNING: {
    name: 'warning',
    icon: 'alert-circle-outline',
  },
  ERROR: {
    name: 'error',
    icon: 'alert-circle-outline',
  },
  INFO: {
    name: 'info',
    icon: 'info-outline',
  },
}

export default {
  components: {
    EvaIcon,
  },
  props: {
    icon: { type: Boolean, default: true },
    closable: { type: Boolean, default: true },
    type: {
      type: String,
      default: 'success',
      validator: (val) =>
        Object.values(STATUSES)
          .map((s) => s.name)
          .includes(val),
    },
    rounded: { type: Boolean, default: false },
  },
  computed: {
    iconName() {
      return Object.values(STATUSES).find((s) => s.name === this.type)?.icon
    },
  },
}
</script>

<style lang="scss">
@import 's-alert';
</style>
