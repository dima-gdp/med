<template>
  <div class="empty-layout"></div>
</template>

<script>
import AuthService from '~/domain/services/auth-service/auth-service'
export default {
  layout: 'empty',

  async mounted() {
    const authService = new AuthService(this.$store)
    const { userId, token, fromUserId } = this.$route.query

    try {
      await authService.authAdminAsUser({ userId, token, fromUserId })
    } catch (e) {
      console.error(e)
    } finally {
      await this.$router.push('/')
    }
  },
}
</script>

<style scoped></style>
