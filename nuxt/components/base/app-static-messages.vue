<template>
  <div>
    <SAlert v-if="$auth.fromUserId" type="info" :closable="false">
      Внимание, вы авторизованы под чужим пользователем!
    </SAlert>

    <div class="static-alert">
      <SAlert
        v-if="isCompanyAlertShown"
        class="company-alert scale-up-ver-top slide-in-top"
        type="warning"
        @close="onCompanyClose"
      >
        <span>
          Для того, чтобы вам стали доступны все функции сайта, заполните, пожалуйста, сведения об
          организации.
          <a class="static-alert__link" href="/user" @click="goRegFull">Заполнить</a>
        </span>
      </SAlert>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import { SAlert } from '@/components/ui-system'

export default {
  components: { SAlert },
  data() {
    return {
      userClosedCompanyAlert: false,
    }
  },
  computed: {
    ...mapState('user', ['userData']),
    ...mapGetters('user', ['hasCompany']),

    userLoaded() {
      return Object.keys(this.userData.profile).length
    },

    isCompanyAlertShown() {
      return this.userLoaded && !this.hasCompany && !this.userClosedCompanyAlert
    },
  },
  methods: {
    onCompanyClose() {
      this.userClosedCompanyAlert = true
    },

    /**
     * @deprecated
     */
    goRegFull() {
      localStorage.setItem('goRegFull', 1)
    },
  },
}
</script>

<style lang="scss">
.static-alert {
  @include adaptive-style([ 'min-height' ], 52px, 50px, 60px);

  &__link {
    @include font-bold;
    color: $color-neutral-snow-white;

    &:hover,
    &active {
      color: $color-neutral-snow-white;
      text-decoration: underline;
    }
  }
}

.slide-in-top {
  animation: slide-in-top 0.5s ease-out both;
  transition: height 0.5s ease-out;
}

@keyframes slide-in-top {
  0% {
    transform: translateY(-1000px);
  }
  100% {
    transform: translateY(0);
    opacity: 1;
  }
}
.scale-up-ver-top {
  animation: scale-up-ver-top 0.3s ease-in-out both;
}
@keyframes scale-up-ver-top {
  0% {
    transform: scaleY(0.4);
    transform-origin: 100% 0%;
  }
  100% {
    transform: scaleY(1);
    transform-origin: 100% 0%;
  }
}
</style>
