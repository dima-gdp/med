import BaseEndpoint from './base-endpoint'

export default class ApiPayment extends BaseEndpoint {
  type = 'payment'
  url = '/payment'
  name = 'payment'
}
