<template>
  <div class="confetti-wrapper">
    <div
      v-for="(item, index) in 149"
      :key="index"
      class="confetti-item"
      :class="`confetti-${item}`"
    ></div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      items: 149,
    }
  },
}
</script>
<style lang="scss">
.confetti-wrapper {
  overflow: hidden;
  height: 100%;
  width: 100%;
}
.confetti-item {
  position: absolute;
}
[class|='confetti'] {
  position: absolute;
}
$colors: (#d13447, #ffbf00, #263672);
@for $i from 0 through 150 {
  $w: random(8);
  $l: random(100);
  .confetti-#{$i} {
    width: #{$w}px;
    height: #{$w * 0.4}px;
    background-color: nth($colors, random(3));
    top: -10%;
    left: unquote($l + '%');
    opacity: random() + 0.5;
    transform: rotate(#{random() * 360}deg);
    animation: drop-#{$i} unquote(4 + random() + 's') unquote(random() + 's') infinite;
  }

  @keyframes drop-#{$i} {
    100% {
      top: 110%;
      left: unquote($l + random(15) + '%');
    }
  }
}
</style>
