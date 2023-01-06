<template>
  <Nuxt />
</template>
<script>
import { getFavicon } from '~/build-vars.js'
export default {
  head() {
    return {
      link: [getFavicon(this.$config.env)],
    }
  },
}
</script>
