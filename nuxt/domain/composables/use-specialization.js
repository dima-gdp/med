import { getExistingApiInstance } from '~/api'

export default function useSpecialization() {
  return {
    async getAllSpecializations() {
      const api = getExistingApiInstance()
      const params = {
        perPage: 0,
        sort: 'name',
      }
      const { data: specs } = await api.specialization.getMany(params)

      return specs
    },
  }
}
