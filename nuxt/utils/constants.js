export const MONTH_NAMES = [
  'Января',
  'Февраля',
  'Марта',
  'Апреля',
  'Мая',
  'Июня',
  'Июля',
  'Августа',
  'Сентября',
  'Октября',
  'Ноября',
  'Декабря',
]

export const BREAKPOINT_NAMES = {
  MOBILE: 'xs',
  TABLET: 'md',
  DESKTOP: 'xl',
}

// должны совпадать с styles/abstract/_layout.scss
export const BREAKPOINT_SIZES = {
  MOBILE: 0,
  TABLET: 748,
  DESKTOP: 1240,
}

export const PIN_LENGTH = 4

export const METHODS_TOKEN_VERIFICATION = {
  TEL: 'call',
  SMS: 'sms',
  MAIL: 'email',
}

export const TYPES_TOKEN_VERIFICATION = {
  PASSWORD_RESET: 'password_reset', // Восстановление и изменение пароля
  REGISTRATION: 'phone_confirm', // Регистрация
  PHONE_CHANGE: 'phone_change', // Изменение телефона
  EMAIL_CHANGE: 'email_change', // Изменение почты
}

export const PAYMENT_STATUS = {
  PAID: 'paid',
  FAILED: 'failed',
  CREATED: 'created',
}

export const ORDER_STATUS = {
  paid: 'paid',
  created: 'created',
  canceled: 'canceled',
}

export const ORDER_STATUS_PARAMS = {
  [ORDER_STATUS.paid]: {
    text: 'оплачен',
    cssClass: 'order-card__status--paid',
  },
  [ORDER_STATUS.created]: {
    text: 'не оплачен',
    cssClass: 'order-card__status--created',
  },
  [ORDER_STATUS.canceled]: {
    text: 'отменён',
    cssClass: 'order-card__status--canceled',
  },
}

export const ORDER_TYPES = {
  MODULE: 'module',
  COURSE_ITERATION: 'course_iteration',
}

export const ORDER_TYPE_PARAMS = {
  [ORDER_TYPES.MODULE]: {
    icon: 'monitor-outline',
  },
  [ORDER_TYPES.COURSE_ITERATION]: {
    text: 'Онлайн-курс',
    icon: 'globe-2',
  },
}

export const ORDER_ITEM_TYPE = {
  MODULE: 'module',
  COURSE_ITERATION: 'course_iteration',
}
