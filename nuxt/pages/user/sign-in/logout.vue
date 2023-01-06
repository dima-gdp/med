<template>
  <div class="logout-layout"></div>
</template>

<script>
import AuthService from '~/domain/services/auth-service/auth-service'
export default {
  layout: 'empty',
  async mounted() {
    const authService = new AuthService(this.$store)
    await authService.logout()
    await this.$router.push('/')
  },
}
</script>

<style scoped lang="scss">
.logout-layout {
  height: 100vh;
  background: $color-neutral-pale-grey;
}
</style>
