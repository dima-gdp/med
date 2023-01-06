import { computed } from '@nuxtjs/composition-api'

export default function useMultiselect(value, label) {
  const checkedLabels = computed(() => {
    if (Array.isArray(value.value)) {
      return value.value.map((el) => el[label.value])
    } else {
      return [value.value[label.value]]
    }
  })

  const isChecked = (option) => {
    return checkedLabels.value.includes(option[label.value])
  }

  const removeOption = (slotLabel) => {
    value.value = value.value.filter((el) => el[label.value] !== slotLabel)
  }

  const hiddenValuesText = (count) => {
    return `и еще ${count}`
  }

  return {
    isChecked,
    removeOption,
    hiddenValuesText,
  }
}
