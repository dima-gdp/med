<template>
  <div
    class="s-error-message color--danger-red t-e-m"
    :style="message ? 'height: 18px; opacity: 1' : 'height: 0px; opacity: 0'"
  >
    {{ message }}
  </div>
</template>

<script>
export default {
  props: {
    message: { type: String, default: '' },
  },
}
</script>

<style lang="scss">
.s-error-message {
  // существует слишком много разных ситуаций: многострочная ошибка, узкое поле формы, малое вертикальное расстояние между полями формы
  // предлагается решать проблему с позиционированием сообщения в рамках компонента-пользователя
  @include adaptive-style([ 'margin-top' ], 2px, 3px, 5px);
  transition: all 0.3s ease-in-out 0s;
}
</style>
