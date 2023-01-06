<template>
  <div class="order-list-page">
    <div class="order-list-page__content container">
      <div class="order-list-page__title h-1">Мои заказы</div>
      <div v-if="!isFirstChunkLoaded" class="order-list-page__preloader">
        <SSpin :size="72" />
      </div>
      <div v-else class="order-list-page__list-block">
        <div>
          <div v-for="(item, idx) in ordersList" :key="idx" class="order-list-page__list-month">
            <div class="order-list-page__title-month h-3 color--cool-grey">{{ item.date }}</div>
            <AppOrderCard
              v-for="order in item.list"
              :key="order.id"
              class="order-list-page__item-order"
              :order="order"
              @create-payment="createPayment"
            >
            </AppOrderCard>
          </div>
        </div>
        <div v-if="canLoadMoreOrders" class="order-list-page__btn-block">
          <transition name="fade">
            <SButton v-if="!isLoading" @click="loadMoreOrders">Показать больше заказов</SButton>
            <SSpin v-else :size="72" />
          </transition>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import AppOrderCard from '~/components/common/app-order-card'
import { SButton, SSpin } from '~/components/ui-system/index'
import OrderService from '~/domain/services/order-service'
import usePayment from '~/domain/composables/use-payment'
import { livechatWidget } from '~/utils/livechat-widget'

export default {
  components: {
    SSpin,
    AppOrderCard,
    SButton,
  },
  middleware: ['redirect-not-logged-in'],

  data() {
    return {
      isFirstChunkLoaded: false,
      isLoading: false,
      ordersList: [],
      pagination: {
        pageCount: 0,
        currentPage: 1,
      },
    }
  },

  head() {
    return {
      script: [livechatWidget],
    }
  },

  computed: {
    ...mapState({
      userId: (state) => state.user.userId,
    }),

    canLoadMoreOrders() {
      return this.pagination.currentPage < this.pagination.pageCount
    },
  },

  async created() {
    try {
      const { ordersList, pagination } = await OrderService.getOrdersList(this.userId)
      this.ordersList = ordersList
      this.pagination = pagination
    } catch (e) {
      console.error(e)
    } finally {
      this.isFirstChunkLoaded = true
    }
  },

  methods: {
    async loadMoreOrders() {
      if (!this.canLoadMoreOrders) return

      try {
        this.isLoading = true
        const page = this.pagination.currentPage + 1
        const { ordersList, pagination } = await OrderService.getOrdersList(this.userId, page)
        this.addNewOrdersToData(ordersList)
        this.pagination = pagination
      } catch (e) {
        console.error(e)
      } finally {
        this.isLoading = false
      }
    },

    addNewOrdersToData(receivedOrdersList) {
      const lastElementOfOrders = this.ordersList[this.ordersList.length - 1]
      if (lastElementOfOrders.date === receivedOrdersList[0].date) {
        lastElementOfOrders.list = [...lastElementOfOrders.list, ...receivedOrdersList[0].list]
        receivedOrdersList.slice(1).forEach((el) => this.ordersList.push(el))
      } else {
        receivedOrdersList.forEach((el) => this.ordersList.push(el))
      }
    },

    async createPayment(orderId) {
      try {
        const { data: payment } = await usePayment().createPayment(orderId)
        window.location.href = payment.confirmationUrl
      } catch (e) {
        console.error(e)
      }
    },
  },
}
</script>

<style lang="scss">
@import 'styles/pages/_order-list-page.scss';
</style>
