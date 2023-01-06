<template>
  <div
    ref="slider"
    class="keen-slider sponsors-slider"
    @mouseover="setPause(true)"
    @mouseout="setPause(false)"
  >
    <div
      v-for="(item, index) in sponsors"
      :key="index"
      class="keen-slider__slide sponsors-slider__item"
    >
      <AppImage :url="require(`~/assets${item.image}`)" alt="logo"></AppImage>
    </div>
  </div>
</template>
<script>
import 'keen-slider/keen-slider.min.css'
import KeenSlider from '~/assets/vendors/keen-slider'
import AppImage from '~/components/common/app-image'

export default {
  components: {
    AppImage,
  },
  props: {
    sponsors: {
      type: Array,
      default() {
        return []
      },
    },
  },
  data() {
    return {
      pause: false,
      interval: null,
    }
  },
  mounted() {
    this.slider = new KeenSlider(this.$refs.slider, {
      slidesPerView: 5,
      mode: 'free',
      spacing: 30,
      loop: true,
      duration: 5000,
      dragStart: () => {
        this.setPause(true)
      },
      dragEnd: () => {
        this.setPause(false)
      },
      breakpoints: {
        '(max-width: 1368.98px)': {
          slidesPerView: 4,
        },
        '(max-width: 991.98px)': {
          slidesPerView: 3,
        },
        '(max-width: 767.98px)': {
          slidesPerView: 2,
        },
      },
    })
    this.setInterval()
  },
  beforeDestroy() {
    if (this.slider) {
      this.slider.destroy()
    }
  },
  methods: {
    setPause(active) {
      this.pause = active
      this.setInterval()
    },
    resetInterval() {
      clearInterval(this.interval)
    },
    setInterval() {
      if (!this.pause) {
        this.slider.next()
      }
      this.resetInterval()
      this.interval = setInterval(() => {
        if (!this.pause) {
          this.slider.next()
        }
      }, 5000)
    },
  },
}
</script>
<style lang="scss">
.sponsors-slider {
  &__item {
    display: flex;
    align-items: center;
    justify-content: center;

    & img {
      height: 100px;
      width: auto;
    }
  }
}
</style>
