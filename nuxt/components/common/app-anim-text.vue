<template>
  <span class="anim-text" @click="changeText">
    <template v-for="(item, index) in data">
      <transition :key="item" name="fade">
        <span v-if="index === active" class="anim-text__item">{{ item }}</span>
      </transition>
    </template>
  </span>
</template>
<script>
export default {
  props: {
    data: {
      type: Array,
      default() {
        return []
      },
    },
  },
  data() {
    return {
      active: 0,
      interval: null,
    }
  },
  mounted() {
    this.interval = setInterval(() => {
      this.changeText()
    }, 10 * 200)
  },
  beforeDestroy() {
    clearInterval(this.interval)
  },
  methods: {
    changeText() {
      const infoListLength = this.data.length
      if (this.active < infoListLength - 1) {
        this.active++
      } else {
        this.active = 0
      }
    },
  },
}
</script>
<style lang="scss">
.anim-text {
  display: flex;
  position: relative;
  width: 100%;
  &__item {
    position: absolute;
    width: 100%;
    opacity: 1;
    transition: all 500ms cubic-bezier(0.64, 0.04, 0.35, 1);
  }
}

.fade-enter-active {
  animation: app-anim-text-fade-in 500ms;
}
.fade-leave-active {
  animation: app-anim-text-fade-out 500ms;
}
@keyframes app-anim-text-fade-in {
  0% {
    transform: translateY(30px);
    opacity: 0;
    // color: red;
  }
  100% {
    transform: translateY(0px);
    opacity: 1;
    // color: red;
  }
}

@keyframes app-anim-text-fade-out {
  0% {
    transform: translateY(0px);
    opacity: 1;
    // color: green;
  }
  100% {
    transform: translateY(-30px);
    opacity: 0;
    // color: green;
  }
}
</style>
