<template>
  <span class="s-tag">
    <span class="s-tag__label">{{ label }}</span>
    <span class="s-tag__icon">
      <EvaIcon name="close-outline" @click="$emit('close-tag')" />
    </span>
  </span>
</template>

<script>
import EvaIcon from '~/components/base/eva-icon'

export default {
  name: 'Tag',
  components: { EvaIcon },
  props: {
    label: {
      type: String,
      required: true,
    },
  },
}
</script>

<style lang="scss">
.s-tag {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  max-width: 100%;
  background: $color-neutral-pale-grey;
  border-radius: 200px;
  padding: 0px 7px 0px 10px;

  &__label {
    margin-right: 5px;
    @include adaptive-style([ 'font-size' ], 14px, 16px, 18px);
    @include adaptive-style([ 'line-height' ], 24px, 26px, 28px);
    color: $color-neutral-cobalt-black;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  &__icon {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 15px;
    color: $color-main-kiwi-green;
    cursor: pointer;
    .eva {
      font-size: 12px;
      font-weight: 500;
    }
  }
}
</style>
