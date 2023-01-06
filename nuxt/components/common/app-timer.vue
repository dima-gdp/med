<template>
  <span class="app-timer">
    {{ prettyTime }}
  </span>
</template>

<script>
export default {
  name: 'AppTimer',
  props: {
    time: { type: Number, default: 0 },
  },
  computed: {
    prettyTime() {
      const p = (t) => `${t}`.padStart(2, '0')
      const m = p(parseInt(this.time / 60))
      const s = p(this.time % 60)
      return `${m}:${s}`
    },
  },
}
</script>
