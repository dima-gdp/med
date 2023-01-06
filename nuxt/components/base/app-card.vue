<template>
  <div class="typical-card">
    <div class="typical-card__image-block">
      <AppImage :url="require(`~/assets${data.image}`)"></AppImage>
    </div>
    <div class="typical-card__title-block">
      <h3 class="typical-card__title sp-b-h">
        {{ data.title }}
      </h3>
    </div>
    <p class="typical-card__description t-p">
      {{ data.description }}
    </p>
    <div class="typical-card__link">
      <SButton :link="data.link">
        {{ data.textLink }}
      </SButton>
    </div>
  </div>
</template>
<script>
import Vue from 'vue'
import AppImage from '~/components/common/app-image'
import { SButton } from '~/components/ui-system/index'

export default Vue.extend({
  components: {
    AppImage,
    SButton,
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
.typical-card {
  background: $color-neutral-snow-white;
  box-shadow: 0px 10px 50px rgba(148, 169, 183, 0.25);
  border-radius: 20px;
  padding: 33px;
  @include media-breakpoint-down(xl) {
    display: grid;
    grid-template-columns: 5fr 7fr;
  }
  @include media-breakpoint-down(md) {
    padding: 15px 25px;
    grid-template-columns: 3fr 7fr;
  }
  &__title-block {
    margin-bottom: 22px;
    @include media-breakpoint-down(xl) {
      margin-top: 13px;
      grid-column-start: 2;
      grid-column-end: 2;
      margin-bottom: 13px;
    }
    @include media-breakpoint-down(md) {
      margin-bottom: 0px;
      grid-row-end: 3;
      grid-row-start: 1;
      display: flex;
      align-items: center;
    }
  }
  &__description {
    margin-bottom: 28px;
    min-height: 112px;
    @include media-breakpoint-down(xl) {
      min-height: 60px;
      grid-column-start: 2;
      grid-column-end: 2;
    }
    @include media-breakpoint-down(md) {
      margin-bottom: 15px;
      margin-top: 10px;
      min-height: 88px;
      grid-column-start: 1;
      grid-column-end: none;
    }
  }
  &__image-block {
    margin-bottom: 30px;
    @include media-breakpoint-down(xl) {
      padding: 0px 30px;
      margin-bottom: 0px;
      grid-column-start: 1;
      grid-column-end: 1;
      grid-row-end: 3;
      grid-row-start: 1;
    }
    @include media-breakpoint-down(md) {
      padding: 0;
      max-width: 60px;
    }
  }
  &__link {
    display: inline-flex;
    @include media-breakpoint-down(xl) {
      grid-column-start: 2;
      grid-column-end: 2;
    }
    @include media-breakpoint-down(md) {
      grid-column-start: 1;
      grid-column-end: none;
      margin-bottom: 15px;
    }
  }
}
</style>
