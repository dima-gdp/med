<template>
  <div class="new-password-page">
    <div class="new-password-page__content container">
      <h1 class="new-password-page__title h1">Введите новый пароль</h1>
      <div class="new-password-page__form-block" @keydown.enter="setNewPassword">
        <ValidationObserver ref="newPasswordForm">
          <div class="new-password-page__form-item">
            <ValidationProvider v-slot="{ errors, failed }" :rules="{ required: true, min6: true }">
              <SInput
                v-model="password"
                placeholder="Введите новый пароль"
                type="password"
                :error="failed"
              />
              <SErrorMessage :message="errors[0]" />
            </ValidationProvider>
          </div>
          <div class="new-password-page__form-item">
            <ValidationProvider v-slot="{ errors, failed }" :rules="{ required: true, min6: true }">
              <SInput
                v-model="repeatPassword"
                placeholder="Введите новый пароль ещё раз"
                type="password"
                :error="failed"
              />
              <SErrorMessage :message="errors[0]" />
            </ValidationProvider>
          </div>
          <div class="new-password-page__btn-block">
            <SButton @click="setNewPassword"> Сохранить новый пароль и авторизоваться </SButton>
          </div>
        </ValidationObserver>
      </div>
    </div>
    <div class="new-password-page__bg"></div>
  </div>
</template>
<script>
import { ValidationProvider, ValidationObserver } from 'vee-validate'
import { throttle } from '~/utils'
import { SErrorMessage, SInput, SButton } from '~/components/ui-system'
import HttpError from '~/domain/errors/http-error'
import LoginError from '~/domain/errors/login-error'
import useGlobalAlert from '~/domain/composables/useGlobalAlert'
import useToken from '~/domain/composables/use-token'
import AuthService from '~/domain/services/auth-service/auth-service.js'

const MISMATCH_PASSWORD_TEXT = 'Пароли не совпадают'
const ERROR_TEXT = 'Произошла ошибка на сервере'
const PASSWORD_RESET_SUCCESS_TEXT = 'Пароль успешно изменен'

export default {
  components: {
    SInput,
    SErrorMessage,
    SButton,
    ValidationProvider,
    ValidationObserver,
  },
  middleware: ['redirect-already-logged-in'],
  data() {
    return {
      password: '',
      repeatPassword: '',
    }
  },
  methods: {
    setNewPassword: throttle(
      async function () {
        const isFormValid = await this.$refs.newPasswordForm.validate()
        if (!isFormValid) {
          return
        }
        if (this.password !== this.repeatPassword) {
          useGlobalAlert().createAlert(MISMATCH_PASSWORD_TEXT, 'error')
          return
        }

        try {
          const isResetPassword = await this.resetPassword()
          if (isResetPassword) {
            await this.login()
          }
        } catch (e) {
          useGlobalAlert().createAlert(ERROR_TEXT, 'error')
          console.error(e)
        }
      },
      5000,
      { trailing: false },
    ),

    async resetPassword() {
      try {
        const password = this.password
        const params = { ...this.$route.query, password }
        const { userId } = await useToken().passwordReset(params)
        if (userId) {
          useGlobalAlert().createAlert(PASSWORD_RESET_SUCCESS_TEXT, 'success')
          return true
        } else {
          useGlobalAlert().createAlert(ERROR_TEXT, 'error')
          return false
        }
      } catch (e) {
        if (e instanceof HttpError) {
          useGlobalAlert().createAlert(e.detailMessage, 'error')
          return false
        } else {
          throw e
        }
      }
    },

    async login() {
      const authService = new AuthService(this.$store)
      const formAuth = {
        identity: this.$route.query.identity,
        password: this.password,
      }
      try {
        await authService.authUser(formAuth)
        useGlobalAlert().createAlert('Авторизация прошла успешно!', 'success')
        await this.$router.push({ path: '/' })
      } catch (e) {
        if (e instanceof LoginError) {
          useGlobalAlert().createAlert(e.message, 'error', 5000)
        } else {
          useGlobalAlert().createAlert('Неизвестная ошибка, попробуйте еще раз', 'error', 5000)
          console.error(e)
        }
      }
    },
  },
}
</script>
<style lang="scss">
@import 'styles/pages/new-password-page';
</style>
