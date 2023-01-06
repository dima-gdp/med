<template>
  <div
    :style="`
      flex-grow: ${grow};
      max-${mode}: ${maxSize}px;
      min-${mode}: ${minSize}px;
      width: 100%;
    `"
  ></div>
</template>

<script>
export default {
  props: {
    maxSize: {
      type: Number,
      default: 50,
    },
    minSize: {
      type: Number,
      default: 0,
    },
    grow: {
      type: Number,
      default: 1,
    },
    mode: {
      type: String,
      default: 'width',
      validator: (val) => ['width', 'height'].includes(val),
    },
  },
}
</script>
