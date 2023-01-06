<template>
  <SAlert v-if="isVisible" @close="onClose" class="promo">
    <span
      >Приглашаем в программу лояльности для активных слушателей портала Med.Studio! Копите знания и
      получайте подарки!</span
    >
    <nuxt-link to="/action" class="promo__link">Перейти к программе →</nuxt-link>
  </SAlert>
</template>

<script>
import { SAlert } from '~/components/ui-system'
import CookieAdapter from '~/utils/cookie-adapter'
import { isPromoVisible, PROMO_VISIBLE_KEY } from '~/domain/services/promo-service'
import usePromo from '~/domain/composables/use-promo'

export default {
  components: {
    SAlert,
  },

  data() {
    return {
      hasCookieClose: false,
    }
  },

  computed: {
    isVisible() {
      if (this.$auth.isLoggedIn && this.$store.state.user.isUserLoaded) {
        return isPromoVisible(this.$store.state.user.userData.hasPromo, this.hasCookieClose)
      }
      return false
    },
  },

  mounted() {
    this.hasCookieClose = Boolean(CookieAdapter.cookieParse(document.cookie)[PROMO_VISIBLE_KEY])
  },

  methods: {
    onClose() {
      this.hasCookieClose = true
      usePromo().setCookiePromoClosed()
    },
  },
}
</script>

<style lang="scss">
.promo {
  &__link {
    color: $color-neutral-snow-white;
    font-weight: 500;
  }
}
</style>
