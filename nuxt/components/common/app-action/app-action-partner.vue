<template>
  <div class="action-partner">
    <div class="action-partner__general">
      <div class="action-partner__general-title">Генеральный спонсор</div>

      <div class="action-partner__general-sponsors">
        <div
          v-for="(sponsor, idx) in sponsors.generalSponsor"
          :key="idx"
          class="action-partner__general-logo"
        >
          <img :src="sponsor.src" alt="general-sponsor" />
        </div>
      </div>
    </div>

    <div class="action-partner__sponsor">
      <div class="action-partner__sponsor-title">Партнеры и спонсоры</div>
      <div class="action-partner__sponsors">
        <div v-for="(partner, idx) in sponsors.partners" :key="idx" class="action-partner__logo">
          <img :src="partner.src" alt="partner" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      sponsors: {
        generalSponsor: [
          { src: './static/action/sponsor-reddys-2x.png' },
          { src: './static/action/sponsor-philips-2x.png' },
        ],
        partners: [
          { src: './static/action/partner-bayer.png' },
          { src: './static/action/partner-bms.png' },
          { src: './static/action/parnter-amgen.png' },
        ],
      },
    }
  },
}
</script>

<style lang="scss">
@import 'styles/components/common/app-action/app-action-partner';
</style>
