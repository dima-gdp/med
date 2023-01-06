<template>
  <div class="payment-page">
    <div class="payment-page__content container">
      <div class="payment-page__header">
        <nuxt-link to="/">
          <img src="~/assets/svg/logo.svg" alt="logo" />
        </nuxt-link>
      </div>
      <div v-if="loading" class="payment-page__loading">
        <SSpin :size="80"></SSpin>
      </div>
      <div v-if="!loading && payment" class="payment-page__body">
        <div class="payment-page__image-block">
          <img
            v-if="payment.status === 'paid'"
            src="~assets/images/payment-page/card.png"
            alt="card"
          />
          <img v-else src="~assets/images/payment-page/card-break.png" alt="card" />
        </div>
        <h1 class="payment-page__title h-1">{{ texts.title }}</h1>
        <div class="payment-page__description">
          {{ texts.fullDescription }}
        </div>
        <div class="payment-page__btn-block">
          <SButton :link="btnPath" class="payment-page__btn">{{ texts.btnText }}</SButton>
        </div>
      </div>
    </div>
    <div class="payment-page__bg"></div>
  </div>
</template>
<script>
import { SButton, SSpin } from '~/components/ui-system/index'
import usePayment from '~/domain/composables/use-payment.ts'
import { PAYMENT_STATUS, ORDER_ITEM_TYPE } from '~/utils/constants'

export default {
  components: {
    SButton,
    SSpin,
  },
  layout: 'empty',
  middleware: ['redirect-not-logged-in'],
  data() {
    return {
      loading: false,
      payment: null,
      texts: {
        title: '',
        descriptionStart: '',
        descriptionEnd: '',
        btnText: '',
      },
      btnPath: '',
    }
  },
  created() {
    this.fetchPayment(this.$route.query.paymentId)
  },
  methods: {
    async fetchPayment(paymentId) {
      this.loading = true
      try {
        this.payment = await usePayment().getPayment(paymentId)
        this.texts = this.defineTexts(this.payment)
        this.btnPath = this.defineBtnPath(this.payment)
      } catch (e) {
        console.error(e)
      } finally {
        this.loading = false
      }
    },
    defineTexts(payment) {
      if (payment.status === PAYMENT_STATUS.PAID) {
        return {
          title: 'Успешная оплата',
          // eslint-disable-next-line no-irregular-whitespace
          fullDescription: `Спасибо за оплату «${payment.orderName}» Вы можете приступить к ознакомлению с ним прямо сейчас, нажав на кнопку ниже`,
          btnText: `Перейти к ${payment.itemType === ORDER_ITEM_TYPE.MODULE ? 'модулю' : 'курсу'}`,
        }
      }
      return {
        title: 'Не удалось оплатить',
        // eslint-disable-next-line no-irregular-whitespace
        fullDescription: `Что-то пошло не так, и мы не смогли принять оплату за «${payment.orderName}». Пожалуйста, попробуйте оплатить его снова, или свяжитесь с нашим менеджером по номеру 8 800 500 26 92`,
        btnText: 'Попытаться оплатить снова',
      }
    },
    defineBtnPath(payment) {
      if (payment.status === PAYMENT_STATUS.PAID) {
        return payment.itemUrl
      }
      return payment.confirmationUrl
    },
  },
}
</script>
<style lang="scss">
@import 'styles/pages/_payment-page.scss';
</style>
