import { ref } from '@nuxtjs/composition-api'
import { debounce, isObject } from '~/utils'
import LogicError from '~/domain/errors/LogicError'

export default function useAsyncSelect(asyncFunction, label) {
  const options = ref([])
  const isLoading = ref(false)
  const optionsValidator = (optionsData) => {
    if (!Array.isArray(optionsData)) {
      throw new LogicError('Список опций должен быть массивом')
    }
    if (optionsData.length) {
      optionsData.forEach((el) => {
        if (!isObject(el)) {
          throw new LogicError('Список должен содержать объекты')
        }
        if (!Object.keys(el).includes(label.value)) {
          throw new LogicError('Список должен содержать поле label')
        }
      })
    }
  }

  const fetchOptions = debounce(async (query) => {
    isLoading.value = true
    try {
      if (!query) {
        return
      }
      const optionsData = await asyncFunction.value(query)
      optionsValidator(optionsData)
      options.value = optionsData
    } catch (e) {
      console.error(e)
    } finally {
      isLoading.value = false
    }
  }, 1000)

  return {
    options,
    isLoading,
    fetchOptions,
  }
}
