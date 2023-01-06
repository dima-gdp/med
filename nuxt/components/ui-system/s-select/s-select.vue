<template>
  <Multiselect
    v-model="value"
    :options="options"
    :searchable="searchable"
    :placeholder="placeholder"
    :show-labels="true"
    :label="label"
    :track-by="trackBy"
    :multiple="multiple"
    :max-height="220"
    v-bind="multiple ? { limit: limit, 'limit-text': hiddenValuesText } : {}"
    :class="{
      'multiselect--compressed': compressed,
      'multiselect--single': !multiple,
      'multiselect--error': error,
    }"
    v-on="listeners"
  >
    <template v-if="asyncFunction" slot="loading">
      <div v-show="isLoading" class="multiselect__spinner">
        <SSpin />
      </div>
    </template>
    <template slot="noResult">
      <div class="multiselect__message">Совпадений не найдено</div>
    </template>
    <template slot="noOptions">
      <div class="multiselect__message">
        {{ emptyMessage }}
      </div>
    </template>
    <template slot="caret" slot-scope="{ toggle }">
      <span class="multiselect__select" @mousedown.prevent="toggle">
        <EvaIcon name="chevron-down" />
      </span>
    </template>
    <template v-if="searchable" slot="option" slot-scope="{ option, search }">
      <div class="multiselect-option">
        <SCheckbox v-if="multiple" :value="isChecked(option)" />
        <div style="width: 8px; flex-shrink: 0"></div>
        <span
          class="multiselect-option__title"
          :class="{ 'multiselect-option__title--searching': search }"
          v-html="highlightSearchedText(option, search)"
        ></span>
      </div>
    </template>
    <template v-if="multiple" slot="tag" slot-scope="{ option }">
      <span class="multiselect__tag">
        <Tag
          :label="option[label]"
          @close-tag="removeOption(option[label])"
          @mousedown.native.prevent
        />
      </span>
    </template>
  </Multiselect>
</template>
<script>
import { toRefs, ref, computed } from '@nuxtjs/composition-api'
import Multiselect from 'vue-multiselect'
import { SCheckbox } from '~/components/ui-system'
import Tag from '~/components/ui-system/s-select/tag.vue'
import EvaIcon from '~/components/base/eva-icon.vue'
import SSpin from '~/components/ui-system/s-spin/s-spin.vue'
import useAsyncSelect from '~/components/ui-system/s-select/composables/use-async-select'
import useSearchedSelect from '~/components/ui-system/s-select/composables/use-searched-select'
import useMultiselect from '~/components/ui-system/s-select/composables/use-multiselect'

export default {
  name: 'SSelect',
  components: { Multiselect, SCheckbox, SSpin, EvaIcon, Tag },
  model: { prop: 'initialValue', event: 'change-select' },
  props: {
    compressed: { type: Boolean, default: false },
    initialOptions: {
      type: Array,
      default: () => {
        return []
      },
    },
    initialValue: {
      type: [Array, Object, null],
      default: () => {
        return []
      },
    },
    placeholder: { type: String, default: '' },
    label: { type: String, required: true },
    trackBy: { type: String, required: true },
    searchable: { type: Boolean, default: false },
    multiple: { type: Boolean, default: false },
    emptyMessage: { type: String, default: 'Список пуст' },
    // eslint-disable-next-line vue/require-default-prop
    asyncFunction: { type: Function },
    limit: { type: Number, default: 3 },
    error: { type: Boolean, default: false },
  },
  setup(props, { emit }) {
    const value = computed({
      get: () => props.initialValue,
      set: (val) => emit('change-select', val),
    })

    const options = ref(props.initialOptions)

    let listeners = {
      close: () => {
        emit('close')
      },
    }
    const { asyncFunction, label } = toRefs(props)

    let returnedCompApiObject = {
      value,
      options,
    }

    // Если селект асинхронный
    if (props.asyncFunction) {
      const { fetchOptions, isLoading, options } = useAsyncSelect(asyncFunction, label)
      returnedCompApiObject = { ...returnedCompApiObject, options, fetchOptions, isLoading }
      listeners = { ...listeners, 'search-change': fetchOptions }
    }

    // Если селект с поиском
    if (props.searchable) {
      const { highlightSearchedText } = useSearchedSelect(label)
      returnedCompApiObject = { ...returnedCompApiObject, highlightSearchedText }
    }

    // Если мультиселект
    if (props.multiple) {
      const { isChecked, removeOption, hiddenValuesText } = useMultiselect(value, label)
      returnedCompApiObject = {
        ...returnedCompApiObject,
        isChecked,
        removeOption,
        hiddenValuesText,
      }
    }

    returnedCompApiObject = { ...returnedCompApiObject, listeners }

    return returnedCompApiObject
  },
}
</script>
<style lang="scss">
@import 's-select';
</style>
