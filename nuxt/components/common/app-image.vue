<template>
  <div>
    <img :src="url" :alt="alt" />
  </div>
</template>
<script>
export default {
  props: {
    url: { type: String, default: '' },
    alt: { type: String, default: '' },
  },
}
</script>
