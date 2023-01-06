import { Deserializer, Serializer } from 'jsonapi-serializer'
import Qs from 'qs'

import HttpError from '~/domain/errors/http-error'
import { kebabToCamel } from '~/utils'

/**
 * @typedef NuxtAxiosInstance
 * @typedef VuexStoreInstance
 */

/**
 * @param {NuxtAxiosInstance} axios
 * @param {VuexStoreInstance} store
 * @returns NuxtAxiosInstance
 */
export default function setupAxios(axios, store) {
  axios.onResponse(async (res) => {
    const jsonApiOpts = { keyForAttribute: 'camelCase', dataLinks: {} }
    const deserializer = new Deserializer(jsonApiOpts)

    const { data, status } = res
    const { meta = {} } = data

    const camelMeta = Object.entries(meta).reduce((accum, [key, value]) => {
      accum[kebabToCamel(key)] = value
      return accum
    }, {})

    if (data.data) {
      const desData = await deserializer.deserialize(data).catch((err) => {
        throw new Error(err.stack)
      })

      return {
        data: desData || [],
        meta: camelMeta || {},
        status,
      }
    }

    return {
      data: res.data || [],
      meta: camelMeta || {},
      status,
    }
  })

  axios.onRequest((config) => {
    config.paramsSerializer = (params) => Qs.stringify(params)
    // eslint-disable-next-line dot-notation
    config.headers['Accept'] = 'application/vnd.api+json'
    const token = store.state.user.userToken
    if (token) {
      config.headers.Authorization = 'Bearer ' + token
    }
    if (config.data) {
      const { type } = config.data
      const attributes = Object.keys(config.data.attributes)
      config.headers['Content-Type'] = 'application/vnd.api+json'

      if (type && attributes) {
        const s = new Serializer(type, {
          attributes,
          keyForAttribute: 'underscore_case',
          pluralizeType: false,
        })
        config.data = s.serialize(config.data.attributes)
      }
    }

    return config
  })

  axios.onError((error) => {
    if (!error.response) {
      throw error
    }
    const { data, status, statusText } = error.response
    const httpError = new HttpError({
      message: `${statusText}: ${status}`,
      status,
      payload: { ...data },
      request: error.request,
    })

    console.error(httpError.shortErrorInfo)

    throw httpError
  })

  return axios
}
