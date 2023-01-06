<template>
  <div v-if="value" class="main-modal-video" @click="onClickBody">
    <button class="main-modal-video__close-btn" @click="close">
      <IconClose></IconClose>
    </button>
    <div class="main-modal-video__content">
      <div class="main-modal-video__video-block">
        <IconSpin v-show="isVideoLoading" class="main-modal-video__preloader"></IconSpin>
        <iframe
          v-if="onVideoLoaded"
          src="https://player.vimeo.com/video/308533363?h=774dc5d5a4"
          frameborder="0"
          allow="autoplay; fullscreen; picture-in-picture"
          allowfullscreen
          @onload="onVideoLoaded"
        ></iframe>
      </div>
    </div>
  </div>
</template>
<script>
import { IconClose, IconSpin } from '~/components/icons/index'

export default {
  components: {
    IconClose,
    IconSpin,
  },
  props: {
    value: { type: Boolean, default: false },
    closeOnEsc: { type: Boolean, default: true },
  },
  data() {
    return {
      isVideoLoading: true,
    }
  },
  watch: {
    value(value) {
      if (value) {
        document.body.style.overflow = 'hidden'
        window.addEventListener('keydown', this.onEsc)
      } else {
        document.body.style.overflow = ''
        window.removeEventListener('keydown', this.onEsc)
      }
    },
  },
  beforeDestroy() {
    window.removeEventListener('keydown', this.onEsc)
  },
  methods: {
    onEsc($event) {
      const ESC_CODE = 'Escape'

      if ($event.code === ESC_CODE && this.closeOnEsc) {
        this.close()
      }
    },

    close() {
      this.$emit('input', false)
    },

    onClickBody(evt) {
      if (
        !evt.target.closest('.main-modal-video__content') &&
        this.closeOnEsc &&
        !evt.target.closest('.main-modal-video__close-btn')
      ) {
        this.$emit('input', !this.value)
      }
    },
    onVideoLoaded() {
      this.isVideoLoading = false
    },
  },
}
</script>
<style lang="scss">
.main-modal-video {
  display: flex;
  position: fixed;
  align-items: center;
  justify-items: center;
  top: 0;
  right: 0;
  width: 100%;
  height: 100%;
  background: $color-neutral-cobalt-black;
  z-index: 5;
  &__close-btn {
    background: none;
    cursor: pointer;
    position: absolute;
    top: 40px;
    right: 40px;
    border: none;
    &:focus {
      outline: none;
      svg {
        fill: $color-status-green-active;
      }
    }
    &:hover {
      svg {
        fill: $color-status-green-hover;
      }
    }
    @include media-breakpoint-down(md) {
      top: 20px;
      right: 20px;
      svg {
        width: 36px;
        height: 36px;
      }
    }
    @include media-breakpoint-down(md) {
      svg {
        width: 24px;
        height: 24px;
      }
    }
  }
  &__content {
    width: 67%;
    background: transparent;
    margin: auto;
    @include media-breakpoint-down(md) {
      width: 100%;
    }
  }
  &__video-block {
    height: 0;
    position: relative;
    width: 100%;
    padding-bottom: 56%;
    iframe {
      position: absolute;
      top: 0px;
      left: 0px;
      width: 100%;
      height: 100%;
    }
  }
  &__preloader {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    top: 0;
    margin: auto;
  }
}
</style>
