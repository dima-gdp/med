<template>
  <div class="medium-card">
    <div class="medium-card__image-block">
      <AppImage :url="require(`~/assets${data.image}`)"></AppImage>
    </div>
    <div class="medium-card__info">
      <h4 class="medium-card__title h-4">
        {{ data.title }}
      </h4>
      <p class="medium-card__description t-p">
        {{ data.description }}
      </p>
    </div>
  </div>
</template>
<script>
import Vue from 'vue'
import AppImage from '~/components/common/app-image'

export default Vue.extend({
  components: {
    AppImage,
  },
  props: {
    data: {
      type: Object,
      default() {
        return {}
      },
    },
  },
})
</script>
<style lang="scss">
.medium-card {
  // padding: 33px;
  @include media-breakpoint-down(xl) {
    padding: 0px;
    column-gap: 30px;
  }
  @include media-breakpoint-down(md) {
    display: grid;
    grid-template-columns: 5fr 7fr;
    column-gap: 30px;
    padding: 0px;
  }
  &__title {
    margin-bottom: 22px;
  }
  &__description {
    margin-bottom: 28px;
    min-height: 112px;
  }
  &__image-block {
    margin-bottom: 16px;
    @include media-breakpoint-down(md) {
      grid-row-end: 3;
      grid-row-start: 1;
    }
  }
  &__info {
    padding-left: 50px;
    @include media-breakpoint-down(md) {
      padding-left: 0px;
    }
  }
}
</style>
