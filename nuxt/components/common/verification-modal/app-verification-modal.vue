<template>
  <SDialog v-model="showModal" :title="title" class="s-dialog--ver-modal">
    <div>
      <AppVerificationTel
        v-if="isTelVerification"
        :contact="contact"
        :tel-token="telToken"
        :token-type="tokenType"
        @change-title="setNewTitle"
        @verification-tel="$emit('verification-tel', $event)"
        @set-token-id="$emit('set-token-id', $event)"
      />
      <AppVerificationMail
        v-else
        :contact="contact"
        :mail-token="mailToken"
        :token-type="tokenType"
        @close="showModal = false"
      />
    </div>
  </SDialog>
</template>

<script>
import { SDialog } from '~/components/ui-system'
import {
  AppVerificationTel,
  AppVerificationMail,
} from '~/components/common/verification-modal/components'
import TEXT from '~/components/common/verification-modal/verification-modal-text'
import { METHODS_TOKEN_VERIFICATION, TYPES_TOKEN_VERIFICATION } from '~/utils/constants'

const VERIFICATION_TYPES = Object.values(METHODS_TOKEN_VERIFICATION)

export default {
  name: 'AppVerificationModal',
  components: { SDialog, AppVerificationTel, AppVerificationMail },
  model: { prop: 'isOpen', event: 'view-modal' },
  props: {
    isOpen: { type: Boolean, default: false },
    type: { type: String, default: 'call', validator: (val) => VERIFICATION_TYPES.includes(val) },
    contact: { type: String, required: true },
    tokenId: { type: String, required: true },
    tokenType: { type: String, default: TYPES_TOKEN_VERIFICATION.PASSWORD_RESET },
  },
  data() {
    return {
      telToken: '',
      mailToken: '',
      title: TEXT[this.type].title,
    }
  },
  computed: {
    showModal: {
      get() {
        return this.isOpen
      },
      set(val) {
        this.$emit('view-modal', val)
      },
    },

    isTelVerification() {
      return this.type === METHODS_TOKEN_VERIFICATION.TEL
    },
  },
  watch: {
    tokenId(val) {
      if (this.isTelVerification) {
        this.telToken = val
      } else {
        this.mailToken = val
      }
    },
    type(val) {
      this.title = TEXT[val].title
    },
  },
  methods: {
    setNewTitle(title) {
      this.title = title
    },
  },
}
</script>

<style lang="scss">
@import 'styles/components/common/verification-modal/app-verification-modal';
</style>
