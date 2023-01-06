<template>
  <transition name="menu">
    <div v-if="value" ref="menu" class="mobile-menu">
      <div class="mobile-menu__header menu-header">
        <div class="menu-header__content container">
          <div class="menu-header__nav">
            <div class="menu-header__logo">
              <nuxt-link to="/">
                <img src="~assets/svg/logo.svg" alt="logo" />
              </nuxt-link>
            </div>
            <div class="menu-header__menu">
              <button class="header-mobile-nav__mobile-btn" @click="close">
                <IconCloseMobileMenu></IconCloseMobileMenu>
              </button>
            </div>
          </div>
        </div>
      </div>
      <div
        v-show="content === 'menu'"
        class="mobile-menu__links-block"
        :class="{ 'dropdown-fade-in': value }"
      >
        <a class="t-m-cat color--cobalt-black" href="/schedule">Расписание</a>
        <a class="t-m-cat color--cobalt-black" href="/course">Курсы</a>
        <a class="t-m-cat color--cobalt-black" href="/program">Проекты</a>
        <SCollapse>
          <SCollapseItem center name="media">
            <template #header>
              <span class="t-m-cat">Медиатека</span>
            </template>
            <div class="t-menu">
              <ul class="ul-no-style">
                <li>
                  <a href="/material/theses" class="t-menu color--kiwi-green"> Конспекты </a>
                </li>
                <li>
                  <a href="/module" class="t-menu color--kiwi-green">Инфомодули</a>
                </li>
                <li>
                  <a href="/material/video" class="t-menu color--kiwi-green"> Видеоархив </a>
                </li>
                <li>
                  <a href="/material/podcast" class="t-menu color--kiwi-green"> Подкасты </a>
                </li>
              </ul>
            </div>
          </SCollapseItem>
        </SCollapse>
        <SCollapse>
          <SCollapseItem center name="media">
            <template #header>
              <span class="t-m-cat">О проекте</span>
            </template>
            <div class="t-menu">
              <ul class="ul-no-style">
                <li>
                  <a href="/lector" class="t-menu color--kiwi-green"> Лекторы </a>
                </li>
                <li>
                  <a href="/partner" class="t-menu color--kiwi-green"> Партнеры </a>
                </li>
                <li>
                  <a href="/about" class="t-menu color--kiwi-green"> О компании </a>
                </li>
              </ul>
            </div>
          </SCollapseItem>
        </SCollapse>
<!--        <nuxt-link to="/action" class="t-m-cat color&#45;&#45;cobalt-black">MS Club</nuxt-link>-->
      </div>
      <div v-show="content === 'user'" class="mobile-menu__links-block">
        <div class="t-menu">
          <ul class="ul-no-style">
            <li v-for="menuItem in userMenu" :key="menuItem.type + menuItem.sort">
              <a
                v-if="menuItem.type !== 'logout'"
                :href="menuItem.url"
                class="t-menu color--kiwi-green"
              >
                {{ menuItem.title }}
              </a>
              <div v-else class="color--kiwi-green" @click="logout">
                {{ menuItem.title }}
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </transition>
</template>
<script>
import { onClickOutside } from '@vueuse/core'
import { ref, useStore, useRouter } from '@nuxtjs/composition-api'
import { IconCloseMobileMenu } from '~/components/icons/index'
import { SCollapse, SCollapseItem } from '~/components/ui-system/index'
import AuthService from '~/domain/services/auth-service/auth-service.js'
export default {
  components: {
    IconCloseMobileMenu,
    SCollapse,
    SCollapseItem,
  },
  props: {
    value: {
      type: Boolean,
      default() {
        return false
      },
    },
    userMenu: {
      type: Array,
      default() {
        return []
      },
    },
    content: {
      type: String,
      default() {
        return 'menu'
      },
    },
  },
  setup(_, { emit }) {
    const menu = ref(null)

    onClickOutside(menu, () => {
      emit('close', false)
    })
    const store = useStore()
    const router = useRouter()

    const close = () => {
      emit('close', false)
    }
    const logout = async () => {
      const authService = new AuthService(store)
      close()
      await authService.logout()
      await router.push({ path: '/' })
    }

    return {
      menu,
      close,
      logout,
    }
  },
}
</script>
<style lang="scss">
.mobile-menu {
  position: absolute;
  width: 100%;
  left: 0px;
  right: 0px;
  top: 0px;
  padding-top: 26px;
  padding-bottom: 140px;
  background: $color-neutral-pale-grey;
  z-index: 5;
  @include media-breakpoint-down(md) {
    padding-top: 6px;
  }
  &__links-block {
    padding: 0px 26px;
    text-align: center;
    display: flex;
    flex-direction: column;
  }
  &__heder {
  }
}
.menu-header {
  padding-bottom: 45px;
  &__content {
  }
  &__nav {
    display: grid;
    grid-template-columns: 7fr 5fr;
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
  &__menu {
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }
}

.menu-enter-active {
  animation: dropdown-fade-in 0.3s;
  @keyframes dropdown-fade-in {
    0% {
      opacity: 0;
    }
    29% {
      opacity: 0.67;
    }
    46% {
      opacity: 0.84;
    }
    50% {
      opacity: 0.88;
    }
    72% {
      opacity: 0.96;
    }
    100% {
      opacity: 1;
    }
  }
}
.menu-leave-active {
  transition: all 300ms cubic-bezier(0.64, 0.04, 0.35, 1);
  opacity: 0;
}
.menu-enter,
.menu-leave-to {
  opacity: 0;
}
</style>
