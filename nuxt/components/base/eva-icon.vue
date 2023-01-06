<template>
  <i class="eva" :class="'eva-' + name" @click="$emit('click')"></i>
</template>

<script lang="js">

export default {
  props: {
    name: {
      type: String,
      default: 'eva-github',
    },
  },
}
</script>
