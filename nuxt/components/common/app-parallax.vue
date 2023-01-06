<template>
  <div class="parallax-bg" :style="scrollBg">
    <img
      class="parallax-bg__item parallax-bg__item_1"
      src="~assets/svg/main-page/bg-bubbles/vector.svg"
    />
    <img
      class="parallax-bg__item parallax-bg__item_2"
      src="~assets/svg/main-page/bg-bubbles/vector-1.svg"
    />
    <img
      class="parallax-bg__item parallax-bg__item_3"
      src="~assets/svg/main-page/bg-bubbles/vector-2.svg"
    />
    <img
      class="parallax-bg__item parallax-bg__item_4"
      src="~assets/svg/main-page/bg-bubbles/vector-3.svg"
    />
    <img
      class="parallax-bg__item parallax-bg__item_5"
      src="~assets/svg/main-page/bg-bubbles/vector-4.svg"
    />
    <img
      class="parallax-bg__item parallax-bg__item_6"
      src="~assets/svg/main-page/bg-bubbles/vector-5.svg"
    />
    <img
      class="parallax-bg__item parallax-bg__item_7"
      src="~assets/svg/main-page/bg-bubbles/vector-6.svg"
    />
    <img
      class="parallax-bg__item parallax-bg__item_8"
      src="~assets/svg/main-page/bg-bubbles/vector-7.svg"
    />
    <img
      class="parallax-bg__item parallax-bg__item_9"
      src="~assets/svg/main-page/bg-bubbles/vector-8.svg"
    />
    <img
      class="parallax-bg__item parallax-bg__item_10"
      src="~assets/svg/main-page/bg-bubbles/vector-9.svg"
    />
    <img
      class="parallax-bg__item parallax-bg__item_11"
      src="~assets/svg/main-page/bg-bubbles/vector-10.svg"
    />
    <img
      class="parallax-bg__item parallax-bg__item_12"
      src="~assets/svg/main-page/bg-bubbles/vector-11.svg"
    />
    <img
      class="parallax-bg__item parallax-bg__item_13"
      src="~assets/svg/main-page/bg-bubbles/vector-12.svg"
    />
    <img
      class="parallax-bg__item parallax-bg__item_14"
      src="~assets/svg/main-page/bg-bubbles/vector-13.svg"
    />
    <img
      class="parallax-bg__item parallax-bg__item_15"
      src="~assets/svg/main-page/bg-bubbles/vector-14.svg"
    />
    <img
      class="parallax-bg__item parallax-bg__item_16"
      src="~assets/svg/main-page/bg-bubbles/vector-15.svg"
    />
    <img
      class="parallax-bg__item parallax-bg__item_17"
      src="~assets/svg/main-page/bg-bubbles/vector-16.svg"
    />
    <img
      class="parallax-bg__item parallax-bg__item_18"
      src="~assets/svg/main-page/bg-bubbles/vector-17.svg"
    />
  </div>
</template>
<script>
export default {
  data() {
    return {
      currentScroll: 0,
    }
  },
  computed: {
    scrollBg() {
      return {
        top: `-${this.currentScroll / 3}px`,
      }
    },
  },
  beforeDestroy() {
    document.removeEventListener('scroll', this.eventScroll)
  },
  mounted() {
    document.addEventListener('scroll', this.eventScroll)
  },
  methods: {
    eventScroll() {
      this.currentScroll = window.scrollY
    },
  },
}
</script>
<style lang="scss">
.parallax-bg {
  background: $color-neutral-pale-grey;
  position: fixed;
  z-index: -1;
  overflow: hidden;
  bottom: 0px;
  &__item {
    position: absolute;
    &_1 {
      left: 300px;
      top: 125px;
      @include media-breakpoint-down(xl) {
        left: -130px;
        top: -160px;
      }
    }
    &_2 {
      right: -35px;
      top: 255px;
    }
    &_3 {
      left: 340px;
      top: 855px;
    }
    &_4 {
      left: 625px;
      top: 1140px;
    }
    &_5 {
      right: 385px;
      top: 1090px;
    }
    &_6 {
      right: 475px;
      top: 1670px;
    }
    &_7 {
      right: 430px;
      top: 2295px;
    }
    &_8 {
      left: 100px;
      top: 2760px;
    }
    &_9 {
      right: 635px;
      top: 3110px;
    }
    &_10 {
      left: 320px;
      top: 3585px;
    }
    &_11 {
      left: 825px;
      top: 4070px;
    }
    &_12 {
      left: 40px;
      top: 4730px;
    }
    &_13 {
      right: 400px;
      top: 5085px;
    }
    &_14 {
      right: -480px;
      top: 5920px;
    }
    &_15 {
      left: 105px;
      top: 6670px;
    }
    &_16 {
      right: 760px;
      top: 6800px;
    }
    &_17 {
      right: 920px;
      top: 7310px;
    }
    &_18 {
      right: 280px;
      top: 7420px;
    }
  }
}
</style>
