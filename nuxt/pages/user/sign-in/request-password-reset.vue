<template>
  <div class="forget-page">
    <AppVerificationModal
      v-model="isShowModal"
      :type="typeVerification"
      :contact="userContact"
      :token-id="tokenId"
      @verification-tel="goToResetPassword"
    />
    <div class="forget-page__content container">
      <div class="forget-page__come-back-block">
        <AppBackLink to="/user/sign-in/login"> Вернуться к авторизации </AppBackLink>
      </div>
      <h1 class="forget-page__title h-1">Восстановление пароля</h1>
      <div class="forget-page__description">
        Чтобы восстановить свой пароль на сайте Med.Studio, пожалуйста введите номер телефона или
        e-mail, который вы указывали при регистрации
      </div>
      <div class="forget-page__form-block" @keydown.enter="startVerification">
        <ValidationObserver ref="requestForm">
          <ValidationProvider v-slot="{ errors, failed }" :rules="{ required: true }">
            <SInput v-model="userContact" placeholder="Ваш телефон или e-mail" :error="failed" />
            <SErrorMessage :message="errors[0]" />
          </ValidationProvider>
          <div class="forget-page__btn-block">
            <SButton @click="startVerification"> Восстановить пароль </SButton>
          </div>
        </ValidationObserver>
      </div>
    </div>
    <div class="forget-page__bg"></div>
  </div>
</template>
<script>
import { ValidationProvider, ValidationObserver } from 'vee-validate'
import { throttle } from '~/utils'
import { SErrorMessage, SInput, SButton } from '~/components/ui-system'
import VerificationService from '~/domain/services/verification-service'
import TEXT from '~/components/common/verification-modal/verification-modal-text'
import AppBackLink from '~/components/base/app-back-link'
import AppVerificationModal from '~/components/common/verification-modal/app-verification-modal'
import { METHODS_TOKEN_VERIFICATION, TYPES_TOKEN_VERIFICATION } from '~/utils/constants'
import HttpError from '~/domain/errors/http-error'
import useGlobalAlert from '~/domain/composables/useGlobalAlert'

export default {
  components: {
    AppBackLink,
    SInput,
    SErrorMessage,
    SButton,
    AppVerificationModal,
    ValidationProvider,
    ValidationObserver,
  },
  middleware: ['redirect-already-logged-in'],
  data() {
    return {
      isShowModal: false,
      userContact: this.$route.query?.identity || '',
      tokenId: '',
    }
  },
  computed: {
    typeVerification() {
      if (this.userContact?.includes('@')) {
        return METHODS_TOKEN_VERIFICATION.MAIL
      } else {
        return METHODS_TOKEN_VERIFICATION.TEL
      }
    },
  },
  methods: {
    startVerification: throttle(
      async function () {
        const isFormValid = await this.$refs.requestForm.validate()
        if (!isFormValid) {
          return
        }

        try {
          await this.setTokenId(this.typeVerification)
        } catch (e) {
          this.onFalsyToken()
          console.error(e)
        }
      },
      5000,
      { trailing: false },
    ),

    goToResetPassword(params) {
      this.$router.push({
        path: 'reset-password',
        query: params,
      })
    },

    async setTokenId(method) {
      try {
        const tokenId = await VerificationService.getToken(
          method,
          this.userContact,
          TYPES_TOKEN_VERIFICATION.PASSWORD_RESET,
        )
        if (tokenId) {
          this.isShowModal = true
          this.tokenId = tokenId
        } else {
          this.onFalsyToken()
        }
      } catch (e) {
        if (e instanceof HttpError) {
          useGlobalAlert().createAlert(e.detailMessage, 'error')
        } else {
          throw e
        }
      }
    },

    onFalsyToken() {
      this.tokenId = ''
      if (this.typeVerification === METHODS_TOKEN_VERIFICATION.TEL) {
        useGlobalAlert().createAlert(TEXT.call.error, 'error')
      } else {
        useGlobalAlert().createAlert(TEXT.email.error, 'error')
      }
    },
  },
}
</script>
<style lang="scss">
@import 'styles/pages/forget-page';
</style>
