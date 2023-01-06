import { NuxtAxiosInstance } from '@nuxtjs/axios'

export default abstract class BaseEndpoint {
  abstract url: string
  abstract type: string
  protected axios: NuxtAxiosInstance

  protected constructor(axios: NuxtAxiosInstance) {
    this.axios = axios
  }

  getOne(id: number, params?: Record<any, any>) {
    return this.axios.request({
      url: `${this.url}/${id}`,
      method: 'GET',
      params,
    })
  }

  getMany(params?: Record<any, any>) {
    return this.axios.request({
      url: `${this.url}`,
      method: 'GET',
      params,
    })
  }

  create(data: Record<any, any>, params?: Record<any, any>) {
    return this.axios.request({
      url: `${this.url}`,
      method: 'POST',
      data: {
        type: this.type,
        attributes: data,
      },
      params,
    })
  }

  update(id: number, data: Record<any, any>, params?: Record<any, any>) {
    return this.axios.request({
      url: `${this.url}/${id}`,
      method: 'PATCH',
      data: {
        type: this.type,
        attributes: data,
      },
      params,
    })
  }

  delete(id: number) {
    return this.axios.request({
      url: `${this.url}/${id}`,
      method: 'DELETE',
    })
  }
}
