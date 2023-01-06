<template>
  <nuxt-link class="header-desktop-nav__login login-block d-f f-c" to="/user/sign-in/login">
    <EvaIcon name="person-outline" class="login-block__icon" />
    <span class="t-m-cat"> Вход </span>
  </nuxt-link>
</template>

<script>
import EvaIcon from '~/components/base/eva-icon'
export default {
  components: {
    EvaIcon,
  },
}
</script>

<style lang="scss">
.login-block {
  cursor: pointer;
  transition: color 300ms cubic-bezier(0.22, 0.61, 0.35, 1);
  color: $color-neutral-cobalt-black;
  &__icon {
    color: $color-main-kiwi-green;
    font-size: 24px;
    margin-right: 5px;
    @include anim-hover;
  }
  &:hover {
    color: $color-status-green-hover;
    .login-block__icon {
      color: $color-status-green-hover;
    }
  }
}
</style>
