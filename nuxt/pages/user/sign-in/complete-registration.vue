<template>
  <div class="complete-registration">
    <div class="complete-registration__content container">
      <AppConfetti class="complete-registration__confetti"></AppConfetti>
      <div class="complete-registration__image-block">
        <img src="~assets/images/complete-registration.png" alt="complete-registration" />
      </div>
      <h1 class="complete-registration__title h1">Вы зарегистрированы!</h1>
      <div class="complete-registration__description">
        Теперь, чтобы активировать учетную запись и воспользоваться всеми возможностями портала
        Med.Studio, например, просмотр вебинаров и конференций, изучение курсов или библиотеки
        материалов, пожалуйста, подтвердите адрес электронной почты, перейдя по ссылки из письма,
        которое отправлено на Ваш e-mail.
      </div>
      <div class="complete-registration__btn-block">
        <SButton class="complete-registration__btn-back" @click="$router.push('/')">
          Вернуться на главную страницу
        </SButton>
      </div>
    </div>
  </div>
</template>
<script>
import { SButton } from '~/components/ui-system/index'
import AppConfetti from '~/components/common/app-confetti'
export default {
  components: {
    SButton,
    AppConfetti,
  },
}
</script>
<style lang="scss">
@import 'styles/pages/complete-registration';
</style>
