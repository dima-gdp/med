import { mount } from '@vue/test-utils'
import PaymentPage from '~/pages/orders/payment'
import {
  mockPaymentCreatedDataFixture,
  mockPaymentFailedDataFixture,
  mockPaymentPaidDataFixture,
} from '~/api/mocs/api-payment-mock'
import flushPromises from '~/utils/flush-promises'

const mockGetPayment = jest.fn()

const mockRouterPush = jest.fn()

function mountPage({ isLoggedIn } = { isLoggedIn: true }) {
  return mount(PaymentPage, {
    mocks: {
      $route: {
        query: {
          paymentId: 1,
        },
      },
      $router: {
        push: mockRouterPush,
      },
      $store: {
        state: {
          user: {
            isLoggedIn,
          },
        },
      },
    },

    stubs: {
      'nuxt-link': true,
    },
  })
}

jest.mock('~/domain/composables/use-payment.ts', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    getPayment: mockGetPayment,
  })),
}))

describe('pages/orders/payment', () => {
  it('Snapshot при статусе payment = created', async () => {
    mockGetPayment.mockImplementationOnce(() => Promise.resolve(mockPaymentCreatedDataFixture))

    const wrapper = mountPage()

    await flushPromises()

    expect(wrapper).toMatchSnapshot()
  })

  it('Snapshot при статусе payment = failed', async () => {
    mockGetPayment.mockImplementationOnce(() => Promise.resolve(mockPaymentFailedDataFixture))

    const wrapper = mountPage()

    await flushPromises()

    expect(wrapper).toMatchSnapshot()
  })

  it('Snapshot при статусе payment = paid', async () => {
    mockGetPayment.mockImplementationOnce(() => Promise.resolve(mockPaymentPaidDataFixture))

    const wrapper = mountPage()

    await flushPromises()

    expect(wrapper).toMatchSnapshot()
  })
})
