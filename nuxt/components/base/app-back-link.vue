<template>
  <div class="back-link">
    <nuxt-link :to="to" class="back-link__link">
      <EvaIcon class="back-link__icon" name="chevron-left-outline"></EvaIcon>
      <slot></slot>
    </nuxt-link>
  </div>
</template>
<script>
import EvaIcon from '~/components/base/eva-icon'
export default {
  components: {
    EvaIcon,
  },
  props: {
    to: { type: String, default: '/' },
  },
}
</script>
<style lang="scss">
.back-link {
  display: inline-flex;
  background: #ffffff;
  border-radius: 500px;
  padding: 8px 30px;
  &__link {
    display: inline-flex;
    align-items: center;
    color: $color-main-kiwi-green;
    font-weight: bold;
    font-size: 18px;
    line-height: 24px;
  }
  &__icon {
  }
}
</style>
