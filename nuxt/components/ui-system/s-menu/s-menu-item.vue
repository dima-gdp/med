<template>
  <li class="s-menu__item s-menu-item">
    <div class="s-menu-item__pad">
      <slot></slot>
    </div>
    <div class="s-menu-item__content" @click="$emit('click')">
      <slot></slot>
    </div>
  </li>
</template>

<script>
export default {}
</script>

<style></style>
