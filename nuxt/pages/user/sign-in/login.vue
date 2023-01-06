<template>
  <div class="login-page">
    <div class="login-page__content container">
      <h1 class="h-1 login-page__title">Вход</h1>
      <div class="login-page__link-block t-p">
        У вас нет логина и пароля?
        <nuxt-link to="/user/sign-in/signup" class="t-b-l color--kiwi-green">
          Зарегистрироваться
        </nuxt-link>
      </div>
      <div class="login-page__form-block" @keydown.enter="handleAuth">
        <ValidationObserver ref="userForm">
          <div class="login-page__form-item">
            <ValidationProvider v-slot="{ errors, failed }" :rules="{ required: true }">
              <SInput
                v-model="formAuth.identity"
                placeholder="Ваш телефон или e-mail *"
                :error="failed"
              />
              <SErrorMessage :message="errors[0]" class="extend-error-message-position" />
            </ValidationProvider>
          </div>
          <div class="login-page__form-item">
            <ValidationProvider v-slot="{ errors, failed }" :rules="{ required: true }">
              <SInput
                v-model="formAuth.password"
                placeholder="Ваш пароль *"
                type="password"
                :error="failed"
              />
              <SErrorMessage :message="errors[0]" />
            </ValidationProvider>
          </div>
          <div class="login-page__forget-link">
            <nuxt-link
              :to="{
                path: '/user/sign-in/request-password-reset',
                query: { identity: formAuth.identity },
              }"
              class="t-menu color--kiwi-green"
            >
              Забыли пароль?
            </nuxt-link>
          </div>
          <div class="login-page__btn-block">
            <SButton :disabled="isLoading" @click="handleAuth"> Войти на сайт </SButton>
          </div>
        </ValidationObserver>
      </div>
    </div>
    <div class="login-page__bg"></div>
  </div>
</template>
<script lang="js">
import { ValidationProvider, ValidationObserver } from 'vee-validate'
import { throttle } from '~/utils'
import { SErrorMessage, SButton, SInput } from '~/components/ui-system/index'
import AuthService from '~/domain/services/auth-service/auth-service.js'
import LoginError from '~/domain/errors/login-error'
import useGlobalAlert from '~/domain/composables/useGlobalAlert'
import useLogin from '~/domain/composables/use-login'

export default {
  components: {
    SButton,
    SInput,
    ValidationProvider,
    ValidationObserver,
    SErrorMessage,
  },
  middleware: ['redirect-already-logged-in'],
  data () {
    return {
      isLoading: false,
      formAuth: {
        identity: '',
        password: '',
      },
    }
  },

  methods: {
    handleAuth: throttle(async function() {
      const alert = useGlobalAlert()

      this.isLoading = true
      const isValid = await this.$refs.userForm.validate()

      if (!isValid) {
        alert.createAlert('Заполните все поля!', 'error', 5000)
        this.isLoading = false
        return
      }
      const authService = new AuthService(this.$store)

      try {
        await authService.authUser(this.formAuth)
        alert.createAlert('Авторизация прошла успешно!', 'success')

        await this.navigateBack()
      } catch (e) {
        if (e instanceof LoginError) {
          alert.createAlert(e.message, 'error', 5000)
        } else {
          alert.createAlert('Неизвестная ошибка, попробуйте еще раз', 'error', 5000)
          console.error(e)
        }
      } finally {
        this.isLoading = false
      }
    }, 5000),

    async navigateBack() {
      await useLogin().navigateBack({
        referrer: document?.referrer,
        router: this.$router,
        query: this.$route.query,
        from: this.$nuxt.context.from,
        location: window.location
      })
    }
  },
}
</script>
<style lang="scss">
@import 'styles/pages/login-page.scss';
</style>
