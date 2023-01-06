<template>
  <div class="card-partner">
    <div class="card-partner__image-block">
      <AppImage :url="require(`~/assets${data.image}`)"></AppImage>
    </div>
    <p class="card-partner__title t-c">
      {{ data.title }}
    </p>
  </div>
</template>
<script>
import AppImage from '~/components/common/app-image'
export default {
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
  data() {
    return {}
  },
}
</script>
<style lang="scss">
.card-partner {
  &__image-block {
    margin-bottom: 24px;
    @include media-breakpoint-down(md) {
      max-width: 85px;
      margin-bottom: 20px;
    }
  }
  &__title {
    max-width: 200px;
    @include media-breakpoint-down(md) {
      max-width: 140px;
    }
  }
}
</style>
