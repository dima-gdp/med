import InfrastructureError from '@/domain/errors/infrastructure-error'
import ApiSpecialization from '@/api/endpoints/api-specialization'
import setupAxios from './setup-axios'
import ApiUser from './endpoints/api-user'
import ApiStats from './endpoints/api-stats'
import ApiToken from './endpoints/api-token'
import ApiPayment from './endpoints/api-payment'
import ApiOrder from './endpoints/api-order'

/**
 * @type {{
 *   user: ApiUser,
 *   stats: ApiStats,
 *   token: ApiToken,
 *   specialization: ApiSpecialization,
 *   payment: ApiPayment,
 * }}
 */
let apiInstance

/**
 *
 * @param {Context} ctx
 */
export function createApiInstance(ctx) {
  if (apiInstance) {
    return apiInstance
  }

  const baseUrl = ctx.$config.apiHost + '/api/v3'

  const newAxiosInstance = ctx.$axios.create()

  newAxiosInstance.setBaseURL(baseUrl)

  const axios = setupAxios(newAxiosInstance, ctx.store)

  apiInstance = {
    user: new ApiUser(axios),
    stats: new ApiStats(axios),
    token: new ApiToken(axios),
    specialization: new ApiSpecialization(axios),
    payment: new ApiPayment(axios),
    order: new ApiOrder(axios),
  }

  return apiInstance
}

export function getExistingApiInstance() {
  if (!apiInstance) {
    throw new InfrastructureError('[api-instance]: инстанс еще не создан!')
  }
  return apiInstance
}
