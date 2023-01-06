export const mockPaymentCreatedDataFixture = {
  id: 9,
  orderId: 1,
  userId: 32,
  invoiceId: '28ada05a-000f-5000-8000-158e10067e04',
  description: 'Оплата заказа №1 для Дмитрий Л libertyswift@yandex.ru',
  paymentMethod: 'bank_card',
  status: 'created',
  order: {
    itemTitle: 'Test',
    itemUrl: '/',
  },
  paidSum: '3000',
  paidCurrency: 'RUB',
  paidAt: null,
  confirmationUrl:
    'https://yoomoney.ru/payments/external/confirmation?orderId=28ada05a-000f-5000-8000-158e10067e04',
  createdAt: 1629195418,
  updatedAt: 1629195418,
}

export const mockCreatePaymentFixture = {
  data: {
    id: 9,
    orderId: 1,
    userId: 32,
    invoiceId: '28ada05a-000f-5000-8000-158e10067e04',
    description: 'Оплата заказа №1 для Дмитрий Л libertyswift@yandex.ru',
    paymentMethod: 'bank_card',
    status: 'created',
    order: {
      itemTitle: 'Test',
      itemUrl: '/',
    },
    paidSum: '3000',
    paidCurrency: 'RUB',
    paidAt: null,
    confirmationUrl:
      'https://yoomoney.ru/payments/external/confirmation?orderId=28ada05a-000f-5000-8000-158e10067e04',
    createdAt: 1629195418,
    updatedAt: 1629195418,
  },
}

export const mockPaymentFailedDataFixture = {
  id: 9,
  orderId: 1,
  userId: 32,
  invoiceId: '28ada05a-000f-5000-8000-158e10067e04',
  description: 'Оплата заказа №1 для Дмитрий Л libertyswift@yandex.ru',
  paymentMethod: 'bank_card',
  status: 'failed',
  order: {
    itemTitle: 'Test',
    itemUrl: '/',
  },
  paidSum: '3000',
  paidCurrency: 'RUB',
  paidAt: null,
  confirmationUrl:
    'https://yoomoney.ru/payments/external/confirmation?orderId=28ada05a-000f-5000-8000-158e10067e04',
  createdAt: 1629195418,
  updatedAt: 1629195418,
}

export const mockPaymentPaidDataFixture = {
  id: 9,
  orderId: 1,
  userId: 32,
  invoiceId: '28ada05a-000f-5000-8000-158e10067e04',
  description: 'Оплата заказа №1 для Дмитрий Л libertyswift@yandex.ru',
  paymentMethod: 'bank_card',
  status: 'paid',
  order: {
    itemTitle: 'Test',
    itemUrl: '/',
  },
  paidSum: '3000',
  paidCurrency: 'RUB',
  paidAt: null,
  confirmationUrl:
    'https://yoomoney.ru/payments/external/confirmation?orderId=28ada05a-000f-5000-8000-158e10067e04',
  createdAt: 1629195418,
  updatedAt: 1629195418,
}
