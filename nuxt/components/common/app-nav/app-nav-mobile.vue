<template>
  <div class="header-mobile-nav">
    <div class="header-mobile-nav__logo">
      <nuxt-link to="/">
        <img src="~assets/svg/logo.svg" alt="logo" />
      </nuxt-link>
    </div>
    <div class="header-mobile-nav__btn-block">
      <template v-if="$auth.isLoggedIn">
        <button
          v-if="user && user.publicIdentity"
          class="header-mobile-nav__mobile-btn"
          @click="openMenu('user')"
        >
          <span class="t-m-cat header-mobile-nav__btn-text">Личный кабинет</span>
          <EvaIcon name="person-outline" class="header-mobile-nav__icon-user" />
          <EvaIcon class="header-mobile-nav__btn-icon" name="chevron-down-outline"></EvaIcon>
        </button>
        <AppSkeletonRectangle
          v-else
          class="header-mobile-nav__preloader"
          height="36px"
          width="180px"
          color="var(--ice-grey)"
        ></AppSkeletonRectangle>
      </template>
      <AppNavLoginButton v-else class="header-mobile-nav__login-button" />
      <button class="header-mobile-nav__mobile-btn" @click="openMenu('menu')">
        <IconMenu></IconMenu>
      </button>
    </div>
    <AppNavModalMobile
      v-model="showMenu"
      class="header-mobile-nav__menu"
      :user-menu="userMenu"
      :content="content"
      @close="closeMenu"
    />
  </div>
</template>
<script>
import AppNavLoginButton from './app-nav-login-button'
import { IconMenu } from '~/components/icons'
import AppSkeletonRectangle from '~/components/base/app-sceletons/app-skeleton-rectangle'
import EvaIcon from '~/components/base/eva-icon'
import AppNavModalMobile from '~/components/common/app-nav/app-nav-modal-mobile'

export default {
  components: {
    AppSkeletonRectangle,
    IconMenu,
    EvaIcon,
    AppNavModalMobile,
    AppNavLoginButton,
  },
  props: {
    user: {
      type: Object,
      default() {
        return {}
      },
    },
    userMenu: {
      type: Array,
      default() {
        return []
      },
    },
    isLoading: {
      type: Boolean,
      default() {
        return false
      },
    },
  },
  data() {
    return {
      showMenu: false,
      content: 'menu',
      menu: null,
      loading: false,
    }
  },
  methods: {
    openMenu(cont) {
      this.showMenu = !this.showMenu
      this.content = cont
    },
    closeMenu(val) {
      this.showMenu = val
    },
  },
}
</script>
<style lang="scss">
.header-mobile-nav {
  @include media-breakpoint-down(md) {
    min-height: 41px;
  }
  &__logo {
    display: flex;
    align-items: center;
    grid-column-start: 1;
    grid-column-end: 2;
    @include media-breakpoint-down(md) {
      max-width: 97px;
    }
  }
  &__mobile-btn {
    display: flex;
    align-items: center;
    padding: 0;
    background: none;
    border: none;
    outline: none;
  }
  &__preloader {
    margin-right: 30px;
    @include media-breakpoint-down(md) {
      display: none;
    }
  }
  &__btn-text {
    @include media-breakpoint-down(md) {
      display: none;
    }
  }
  &__btn-icon {
    color: $color-main-kiwi-green;
    font-size: 20px;
    @include media-breakpoint-down(md) {
      display: none;
    }
  }
  &__icon-user {
    display: none;
    color: $color-main-kiwi-green;
    font-size: 24px;
    margin-right: 5px;
    @include anim-hover;
    @include media-breakpoint-down(md) {
      display: inline-flex;
      font-size: 40px;
    }
  }
  &__btn-block {
    display: flex;
  }
  &__mobile-btn + &__mobile-btn {
    margin-left: 10px;
  }

  &__login-button {
    margin-right: 30px;
  }
}
</style>
