<template>
  <div class="layout d-f f-col">
<!--    <AppActionAlert />-->
    <AppStaticMessages />
    <AppHeader />
    <div class="f-g-1">
      <Nuxt />
    </div>
    <AppFooter></AppFooter>
    <AppGlobalAlert />
  </div>
</template>

<script>
import AppHeader from '~/components/base/app-header'
import AppFooter from '~/components/base/app-footer'
import AppGlobalAlert from '~/components/base/app-global-alert'
import AppStaticMessages from '~/components/base/app-static-messages'
// import AppActionAlert from '~/components/common/app-action-alert'
import { getFavicon } from '~/build-vars.js'

export default {
  components: {
    AppHeader,
    AppFooter,
    AppGlobalAlert,
    AppStaticMessages,
    // AppActionAlert,
  },
  head() {
    return {
      link: [getFavicon(this.$config.env)],
    }
  },
}
</script>
