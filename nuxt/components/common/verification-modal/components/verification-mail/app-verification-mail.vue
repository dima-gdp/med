<template>
  <div class="verification-modal-mail verification-modal">
    <p class="verification-modal-mail__text verification-modal__text">
      Мы отправили письмо со ссылкой на восстановление пароля на ваш адрес электронной почты.
      Пожалуйста, проверьте папку «Входящие» и папку «Спам» — иногда письма по ошибке попадают в
      неё.
    </p>
    <div class="verification-modal-mail__buttons">
      <SButton
        type="solid"
        color="green"
        class="verification-modal-mail__link"
        @click="$emit('close')"
      >
        <span>Вернуться<span class="mobile-hide"> на страницу восстановления пароля</span></span>
      </SButton>
      <button
        v-if="isSendAgain"
        class="verification-modal-mail__btn-send"
        type="button"
        @click.stop="sendLetterAgain"
      >
        Письмо не пришло
      </button>
      <p v-else class="verification-modal-mail__message">
        Мы отправили письмо ещё раз <AppTimer :time="timer" />
      </p>
    </div>
  </div>
</template>

<script>
import { SButton } from '~/components/ui-system'
import AppTimer from '~/components/common/app-timer.vue'
import { METHODS_TOKEN_VERIFICATION } from '~/utils/constants'
import VerificationService from '~/domain/services/verification-service'
import HttpError from '~/domain/errors/http-error'
import useGlobalAlert from '~/domain/composables/useGlobalAlert'
import TEXT from '~/components/common/verification-modal/verification-modal-text'

const TIMER_SECONDS = 60

export default {
  name: 'AppVerificationMail',
  components: { SButton, AppTimer },
  props: {
    contact: { type: String, required: true },
    mailToken: { type: String, required: true },
    tokenType: { type: String, required: true },
  },
  data() {
    return {
      isSendAgain: true,
      timer: TIMER_SECONDS,
      tokenId: this.mailToken,
    }
  },
  methods: {
    async sendLetterAgain() {
      if (!this.isSendAgain) {
        return
      }

      try {
        await this.sendLetter(METHODS_TOKEN_VERIFICATION.MAIL)
      } catch (e) {
        useGlobalAlert().createAlert(TEXT.email.error, 'error')
        console.error(e)
      }
    },

    runTimer() {
      this.timer -= 1
      const timer = setTimeout(this.runTimer, 1000)
      if (this.timer <= 0) {
        clearInterval(timer)
        this.isSendAgain = true
      }
    },

    async sendLetter(method) {
      try {
        const tokenId = await VerificationService.getToken(method, this.contact, this.tokenType)
        if (tokenId) {
          this.isSendAgain = false
          this.timer = TIMER_SECONDS
          this.runTimer()
          this.tokenId = tokenId
        } else {
          useGlobalAlert().createAlert(TEXT.email.error, 'error')
          this.tokenId = null
        }
      } catch (e) {
        if (e instanceof HttpError) {
          useGlobalAlert().createAlert(e.detailMessage, 'error')
        } else {
          throw e
        }
      }
    },
  },
}
</script>

<style lang="scss">
@import 'styles/components/common/verification-modal/verification-mail/app-verification-mail';
</style>
