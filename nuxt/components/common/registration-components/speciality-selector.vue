<template>
  <div class="speciality-selector">
    <div v-if="!$fetchState.pending" class="speciality-selector__grid grid">
      <div class="speciality-selector__inputs g-c-1-7 md-g-c-1-8 xs-g-c-1-13">
        <div v-for="(_, index) in selectedSpecs" :key="index" class="d-f f-col">
          <span class="d-f f-c">
            <SSelect
              v-model="selectedSpecs[index]"
              class="speciality-selector__control--select"
              label="name"
              track-by="id"
              :placeholder="getSelectSpecsPlaceholder(index)"
              :initial-options="nonSelectedSpecs"
              :searchable="true"
              :error="!!errors.length"
              empty-message="Начните вводить специальность"
              @close="$emit('leave')"
              @change-select="updateVModel(selectedSpecs)"
            />
            <template v-if="index > 0">
              <AppSpacer :max-size="20"></AppSpacer>
              <div class="speciality-selector__trash-icon" @click="deleteSpec(index)">
                <IconTrash color="var(--danger-red)" />
              </div>
            </template>
          </span>
          <SErrorMessage :message="errors[0]" />
        </div>
        <div class="speciality-selector__add">
          <SButton
            compressed
            :disabled="selectedSpecs[0] === null"
            @click="selectedSpecs.push(null)"
          >
            + Добавить специальность
          </SButton>
        </div>
      </div>
      <div class="t-c color--cool-grey g-c-7-13 md-g-c-8-13 xs-g-c-1-13">
        Зная вашу специальность мы сможем показывать вам более полезные вебинары и мероприятия на
        сайте Med.Studio
      </div>
    </div>
    <div v-else>
      <AppSkeletonRectangle width="60%" />
      <div class="b-h-3"></div>
      <AppSkeletonRectangle width="40%" />
      <div class="d-none xs-d-block" style="height: 54px"></div>
    </div>
  </div>
</template>

<script>
import IconTrash from '@/components/icons/icon-trash'
import { filter, includes, map, prop } from 'ramda'
import { mapState } from 'vuex'
import useSpecialization from '~/domain/composables/use-specialization'
import { SButton, SErrorMessage, SSelect } from '~/components/ui-system'
import AppSpacer from '~/components/common/app-spacer'
import AppSkeletonRectangle from '~/components/base/app-sceletons/app-skeleton-rectangle'

/**
 * Отдельный стилизованный компонент, который реализует логику мультиселектора специальностей,
 * без использования мультиселекта(бизнес требование)
 * Синхронизируется по v-model, принимает состояние валидации сверху, отправляет на верх событие blur для запуска валидации
 */
export default {
  components: {
    SSelect,
    SButton,
    AppSpacer,
    IconTrash,
    SErrorMessage,
    AppSkeletonRectangle,
  },
  props: {
    value: { type: Array, default: () => [null] },
    errors: { type: Array, default: () => [] },
  },
  data() {
    return {
      selectedSpecs: [],
      specialties: [],
    }
  },
  async fetch() {
    this.specialties = await useSpecialization().getAllSpecializations()
  },

  computed: {
    ...mapState(['currentBreakpoint']),
    nonSelectedSpecs() {
      // эксперименты с ramda js
      const selectedIds = map(prop('id'), this.selectedSpecs)
      return filter((s) => !includes(prop('id', s), selectedIds), this.specialties ?? [])
    },
  },

  watch: {
    value: {
      immediate: true,
      deep: true,
      handler(selectedSpecs) {
        this.selectedSpecs = selectedSpecs
      },
    },
  },

  methods: {
    getSelectSpecsPlaceholder(index) {
      if (index === 0) {
        return 'Ваша основная специальность *'
      } else if (this.currentBreakpoint === 'xs') {
        return 'Доп. специальность *'
      }
      return 'Дополнительная специальность *'
    },

    updateVModel(specs) {
      this.$emit('input', specs)
    },

    deleteSpec(idx) {
      const selectedSpecs = this.selectedSpecs.filter((_, i) => i !== idx)
      this.updateVModel(selectedSpecs)
    },
  },
}
</script>

<style lang="scss">
.speciality-selector {
  &__grid {
    row-gap: 20px;
  }
  &__inputs {
    row-gap: 24px;
    display: grid;
  }
  &__add {
    max-width: 283px;
  }

  &__trash-icon {
    cursor: pointer;
  }
}
</style>
