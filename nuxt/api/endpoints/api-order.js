import BaseEndpoint from './base-endpoint'

export default class ApiOrder extends BaseEndpoint {
  type = 'order'
  url = '/order'
}
