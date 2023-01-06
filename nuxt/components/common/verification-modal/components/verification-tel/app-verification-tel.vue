<template>
  <div class="verification-modal-tel verification-modal">
    <p class="verification-modal-tel__text verification-modal__text">
      {{ getText.desc }}
    </p>
    <div class="verification-modal-tel__form">
      <div class="verification-modal-tel__input">
        <SInputPin v-model="code" @change-pin="validateInputCode" />
      </div>
      <SButton type="solid" color="green" :disabled="disabledSend" @click="sendCode">
        Отправить код
      </SButton>
    </div>
    <SButton
      type="ghost"
      color="green"
      :disabled="!!timer"
      class="verification-modal-tel__verify-btn"
      @click="toggleTypeVerification"
      @click.native.stop
    >
      <span v-html="getText.button"></span>
      <AppTimer v-if="!isSMS" class="verification-modal-tel__timer" :time="timer" />
    </SButton>
  </div>
</template>

<script>
import useGlobalAlert from '~/domain/composables/useGlobalAlert'
import VerificationService from '~/domain/services/verification-service'
import { SInputPin, SButton } from '~/components/ui-system'
import AppTimer from '~/components/common/app-timer.vue'
import TEXT from '~/components/common/verification-modal/verification-modal-text'
import { METHODS_TOKEN_VERIFICATION } from '~/utils/constants'
import HttpError from '~/domain/errors/http-error'

const TIMER_SECONDS = 120

export default {
  name: 'AppVerificationTel',
  components: { SInputPin, SButton, AppTimer },
  props: {
    contact: { type: String, required: true },
    telToken: { type: String, required: true },
    tokenType: { type: String, required: true },
  },
  data() {
    return {
      code: [],
      tokenId: this.telToken,
      timer: TIMER_SECONDS,
      isSMS: false,
      disabledSend: true,
    }
  },
  computed: {
    getText() {
      return this.isSMS ? TEXT.sms : TEXT.call
    },
  },
  mounted() {
    this.runTimer()
  },
  methods: {
    runTimer() {
      this.timer -= 1
      const timer = setTimeout(this.runTimer, 1000)
      if (this.timer <= 0) {
        clearInterval(timer)
      }
    },

    async toggleTypeVerification() {
      this.isSMS = !this.isSMS
      if (this.isSMS) {
        await this.changeModalState(METHODS_TOKEN_VERIFICATION.SMS, this.tokenType, TEXT.sms.title)
      } else {
        await this.changeModalState(METHODS_TOKEN_VERIFICATION.TEL, this.tokenType, TEXT.call.title)
        this.timer = TIMER_SECONDS
        this.runTimer()
      }
    },

    onSuccessVerificationCode() {
      this.$emit('verification-tel', {
        identity: this.contact,
        tokenId: this.tokenId,
        token: this.code.join(''),
      })
      useGlobalAlert().createAlert(TEXT.call.success, 'success')
      this.code = []
    },

    sendCode() {
      VerificationService.sendCode(this.code, this.tokenId, this.onSuccessVerificationCode)
    },

    async changeModalState(method, tokenType, title) {
      this.code = []
      this.disabledSend = true
      try {
        await this.setTokenId(method, tokenType)
      } catch (e) {
        console.error(e)
        useGlobalAlert().createAlert(TEXT.call.error, 'error')
      } finally {
        this.$emit('change-title', title)
      }
    },

    validateInputCode() {
      this.disabledSend = VerificationService.isDirtyCode(this.code)
    },

    async setTokenId(method, tokenType) {
      try {
        const tokenId = await VerificationService.getToken(method, this.contact, tokenType)
        if (tokenId) {
          this.tokenId = tokenId
          this.$emit('set-token-id', this.tokenId)
        } else {
          useGlobalAlert().createAlert(TEXT.call.error, 'error')
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
@import 'styles/components/common/verification-modal/verification-tel/app-verification-tel';
</style>
