<template>
  <div class="order-card">
    <div class="order-card__image-block">
      <img src="~/assets/svg/logo.svg" alt="icon" />
    </div>
    <div class="order-card__content-block">
      <div class="order-card__info-block">
        <div v-if="getTypeName" class="order-card__type h-6 color--king-blue">
          <EvaIcon class="order-card__icon-type" :name="getTypeIcon"></EvaIcon>
          {{ getTypeName }}
        </div>
        <div class="order-card__status card-timer-compress" :class="getStatusParams.cssClass">
          {{ getStatusParams.text }}
        </div>
        <div class="order-card__number color--cool-grey card-data-compress">
          Заказ №{{ order.id }}
        </div>
      </div>
      <h3 class="order-card__title h-4">{{ order.itemTitle }}</h3>
      <div class="order-card__footer">
        <div class="order-card__price order-card__price--failed h-3">{{ order.cost }} ₽</div>
        <div class="order-card__btn-block">
          <SButton
            v-if="order.status === $options.ORDER_STATUS.created"
            type="solid"
            compressed
            color="yellow"
            icon="left"
            :icon-name="'credit-card-outline'"
            @click="$emit('create-payment', order.id)"
            >Оплатить</SButton
          >
          <SButton type="ghost" compressed :link="order.itemUrl">Подробнее</SButton>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { SButton } from '~/components/ui-system/index'
import EvaIcon from '~/components/base/eva-icon'
import {
  ORDER_STATUS,
  ORDER_STATUS_PARAMS,
  ORDER_TYPE_PARAMS,
  ORDER_TYPES,
} from '~/utils/constants'

export default {
  ORDER_STATUS,
  components: {
    SButton,
    EvaIcon,
  },
  props: {
    order: { type: Object, default: () => {} },
  },
  data() {
    return {}
  },

  computed: {
    getTypeIcon() {
      return ORDER_TYPE_PARAMS[this.order.item].icon
    },

    getStatusParams() {
      return ORDER_STATUS_PARAMS[this.order.status]
    },

    getTypeName() {
      if (this.order.item !== ORDER_TYPES.MODULE) {
        return ORDER_TYPE_PARAMS[this.order.item]?.text
      } else {
        return this.order.moduleItem?.moduleType?.type
      }
    },
  },
}
</script>
<style lang="scss">
.order-card {
  background: #fff;
  box-shadow: 0px 10px 50px rgba(148, 169, 183, 0.25);
  border-radius: 20px;
  display: grid;
  grid-template-columns: 2fr repeat(10, 1fr);
  overflow: hidden;

  @include media-breakpoint-down(xl) {
    grid-template-columns: 3fr repeat(9, 1fr);
  }

  @include media-breakpoint-down(md) {
    grid-template-columns: 1fr;
  }

  &__info-block {
    display: flex;
    margin-bottom: 10px;
    align-items: center;
    flex-wrap: wrap;
  }
  &__title {
    margin-bottom: 16px;
  }
  &__content-block {
    padding: 25px;
    grid-column-start: 2;
    grid-column-end: 12;

    @include media-breakpoint-down(md) {
      padding: 12px;
      grid-column-start: 3;
      grid-column-end: 12;
    }
  }
  &__image-block {
    background: $color-neutral-pale-grey;
    display: flex;
    align-items: center;
    justify-content: center;
    @include media-breakpoint-down(md) {
      display: none;
    }
  }
  &__btn-block {
    display: flex;
  }
  &__status {
    text-transform: uppercase;
    margin-right: 20px;
    &--paid {
      color: $color-alert-success-green;
    }
    &--canceled {
      color: $color-alert-danger-red;
    }
    &--created {
      color: $color-alert-warning-yellow;
    }

    @include media-breakpoint-down(md) {
      margin-bottom: 8px;
    }
  }
  &__type {
    display: flex;
    margin-right: 20px;
    align-items: center;

    @include media-breakpoint-down(md) {
      margin-bottom: 8px;
    }
  }
  &__icon-type {
    margin-right: 10px;
    font-size: 20px;
  }
  &__price {
    margin-right: 20px;
    color: $color-neutral-cool-grey;
    &--failed {
      color: $color-alert-pale-danger;
    }
    @include media-breakpoint-down(md) {
      margin-bottom: 10px;
    }
  }
  &__footer {
    display: flex;

    @include media-breakpoint-down(md) {
      display: block;
    }
  }
  .s-btn + .s-btn {
    margin-left: 20px;
  }
}
</style>
