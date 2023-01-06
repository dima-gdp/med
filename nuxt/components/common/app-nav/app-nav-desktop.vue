<template>
  <div class="header-desktop-nav">
    <div class="header-desktop-nav__main-menu d-f">
      <div class="header-desktop-nav__logo">
        <nuxt-link to="/">
          <img src="~/assets/svg/logo.svg" alt="logo" />
        </nuxt-link>
      </div>
      <div style="width: 60px"></div>
      <div class="header-desktop-nav__menu">
        <SMenu :icon="false">
          <template #head>
            <span class="t-m-cat">
              <a href="/schedule" class="t-m-cat color--cobalt-black">Расписание</a>
            </span>
          </template>
        </SMenu>
        <SMenu :icon="false">
          <template #head>
            <span class="t-m-cat">
              <a href="/course" class="t-m-cat color--cobalt-black">Курсы</a>
            </span>
          </template>
        </SMenu>
        <SMenu :icon="false">
          <template #head>
            <span class="t-m-cat">
              <a href="/program" class="t-m-cat color--cobalt-black">Проекты</a>
            </span>
          </template>
        </SMenu>
        <SMenu>
          <template #head>
            <span class="t-m-cat"> Медиатека </span>
          </template>
          <SMenuItem>
            <a href="/material/video" class="color--cobalt-black">Видеоархив</a>
          </SMenuItem>
          <SMenuItem>
            <a href="/material/theses" class="color--cobalt-black">Конспекты</a>
          </SMenuItem>
          <SMenuItem>
            <a href="/module" class="color--cobalt-black">Инфомодули</a>
          </SMenuItem>
          <SMenuItem>
            <a href="/material/podcast" class="color--cobalt-black">Подкасты</a>
          </SMenuItem>
        </SMenu>
        <SMenu>
          <template #head>
            <span class="t-m-cat"> О проекте </span>
          </template>
          <SMenuItem>
            <a href="/lector" class="color--cobalt-black">Лекторы</a>
          </SMenuItem>
          <SMenuItem>
            <a href="/partner" class="color--cobalt-black">Партнеры</a>
          </SMenuItem>
          <SMenuItem>
            <a href="/about" class="color--cobalt-black">О компании</a>
          </SMenuItem>
        </SMenu>
<!--        <SMenu :icon="false">-->
<!--          <template #head>-->
<!--            <span class="t-m-cat">-->
<!--              <nuxt-link to="/action" class="t-m-cat color&#45;&#45;cobalt-black">MS Club</nuxt-link>-->
<!--            </span>-->
<!--          </template>-->
<!--        </SMenu>-->
      </div>
    </div>
    <div class="header-desktop-nav__user-menu">
      <template v-if="$auth.isLoggedIn">
        <SMenu v-if="user && user.publicIdentity">
          <template #head>
            <span class="t-m-cat">Личный кабинет</span>
          </template>
          <SMenuItem v-for="menuItem in userMenu" :key="menuItem.type + menuItem.sort">
            <a
              v-if="menuItem.type !== 'logout'"
              :href="menuItem.url"
              target="_self"
              class="color--cobalt-black"
            >
              {{ menuItem.title }}
            </a>
            <div v-else class="color--cobalt-black" @click="logout">
              {{ menuItem.title }}
            </div>
          </SMenuItem>
        </SMenu>
        <div v-else>
          <AppSkeletonRectangle
            height="42px"
            width="200px"
            color="var(--ice-grey)"
          ></AppSkeletonRectangle>
        </div>
      </template>
      <AppNavLoginButton v-else />
    </div>
  </div>
</template>
<script>
import AppNavLoginButton from './app-nav-login-button'
import { SMenu, SMenuItem } from '~/components/ui-system'
import AppSkeletonRectangle from '~/components/base/app-sceletons/app-skeleton-rectangle'
import AuthService from '~/domain/services/auth-service/auth-service.js'

export default {
  components: {
    SMenu,
    SMenuItem,
    AppSkeletonRectangle,
    AppNavLoginButton,
  },
  props: {
    user: { type: Object, default: () => ({}) },
    userMenu: { type: Array, default: () => [] },
    isLoading: { type: Boolean, default: false },
  },
  methods: {
    async logout() {
      const authService = new AuthService(this.$store)
      await authService.logout()
      await this.$router.push({ path: '/' })
    },
  },
}
</script>
<style lang="scss">
.header-desktop-nav {
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
    justify-content: space-between;

    @include media-breakpoint-down(xl) {
      display: none;
    }
  }
  &__user-menu {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    max-width: 260px;
  }
  &__main-menu {
  }
}
</style>
