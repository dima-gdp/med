<template>
  <header class="header">
    <div class="header__content container">
      <div class="d-block xs-d-none md-d-none">
        <AppNavDesktop
          class="header__nav d-f f-s-b"
          :user="user"
          :user-menu="menuItems"
          :is-loading="userIsLoading"
        />
      </div>
      <div class="d-none xs-d-block md-d-block">
        <AppNavMobile
          class="header__nav d-f f-s-b"
          :user="user"
          :user-menu="menuItems"
          :is-loading="userIsLoading"
        />
      </div>
    </div>
  </header>
</template>
<script>
import { mapState } from 'vuex'
import AppNavDesktop from '~/components/common/app-nav/app-nav-desktop'
import AppNavMobile from '~/components/common/app-nav/app-nav-mobile'
import UserDataService from '~/domain/services/user-data-service'

export default {
  components: {
    AppNavDesktop,
    AppNavMobile,
  },
  computed: {
    ...mapState({
      userIsLoading: (state) => state.user.userDataIsLoading,
      user: (state) => state.user.userData,
      menu: (state) => state.user.menu,
      currentBreakpoint: (state) => state.currentBreakpoint,
    }),
    menuItems() {
      if (this.menu && this.menu.length) {
        return this.generateUserMenu(this.menu)
      }
      return []
    },
  },
  async mounted() {
    if (this.$store.state.user.isLoggedIn) {
      const userDataService = new UserDataService(this.$store)
      await userDataService.fetchUserData(this.$store.state.user.userId)
    }
  },
  methods: {
    generateUserMenu(userMenuData) {
      const possibleMenuItems = [
        {
          type: 'panel',
          url: '/admin',
          title: 'Панель управления',
          sort: 1,
        },
        {
          type: 'profile',
          url: '/user',
          title: 'Профиль',
          sort: 2,
        },
        {
          type: 'subscribe',
          url: '/mysubscribe',
          title: 'Подписки',
          sort: 3,
        },
        {
          type: 'certificate',
          url: '/certificate',
          title: 'Сертификаты',
          sort: 4,
        },
        {
          type: 'curator',
          url: '/user/curator/',
          title: 'Кабинет куратора',
          sort: 5,
        },
        {
          type: 'course',
          url: '/user/course/',
          title: 'Мои курсы',
          sort: 6,
        },
        {
          type: 'orders',
          url: '/orders/list',
          title: 'Мои заказы',
          sort: 7,
        },
        {
          type: 'logout',
          url: '/user/sign-in/logout',
          title: 'Выйти',
          sort: 8,
        },
      ]

      return userMenuData
        .filter(({ visible }) => visible)
        .map(({ type }) => ({
          ...possibleMenuItems.find((p) => p.type === type),
        }))
        .sort((a, b) => a.sort - b.sort)
    },
  },
}
</script>
<style lang="scss">
@import 'styles/utility-classes/layout';
.header {
  position: relative;

  &__mobile-menu {
    justify-content: flex-end;

    @include media-breakpoint-up(xl) {
      display: none;
    }

    @include media-breakpoint-down(md) {
      grid-column-start: 3;
      display: flex;
    }
  }
}
</style>
