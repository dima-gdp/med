<template>
  <div class="rating-table">
    <div class="rating-table__table-container">
      <div class="rating-table__filter-block">
        <h2 class="rating-table__title">Рейтинг участников</h2>

        <div class="rating-table__filter">
          <SSelect
            v-model="userSpecialities.value"
            placeholder="Введите название"
            label="title"
            track-by="title"
            :initial-options="sortedUserSpecialities"
            :compressed="true"
            @change-select="getChangeFilter(userSpecialities.value.title)"
          />
        </div>
      </div>

      <div class="rating-table__table table-info">
        <div class="table-info__header">
          <div class="table-info__title">#</div>
          <div class="table-info__title">Баллы</div>
          <div class="table-info__title">ФИО участника</div>
        </div>
        <ul>
          <li v-for="(userInfo, idx) in usersList" :key="idx" class="table-info__content">
            <span class="table-info__info table-info__limit-text">{{ userInfo.rank }}</span>
            <span class="table-info__info table-info__limit-text">{{ userInfo.rate }}</span>
            <span class="table-info__info table-info__limit-text">{{ userInfo.fullName }}</span>
          </li>
        </ul>
      </div>
    </div>

    <div class="rating-table__personal-rating">
      <AppActionPersonalRating :user="user" />
    </div>
  </div>
</template>

<script>
import AppActionPersonalRating from '~/components/common/app-action/app-action-personal-rating'
import { SSelect } from '~/components/ui-system'

export default {
  components: { AppActionPersonalRating, SSelect },

  props: {
    usersList: { type: Array, default: () => [] },
    user: { type: Object, default: () => ({}) },
  },

  // TODO: Унести в доменную логику
  data() {
    return {
      userSpecialities: {
        value: { title: 'Все специальности', desc: 'Все специальности' },
        options: [
          { title: 'Кардиология', desc: 'Кардиология' },
          { title: 'Хирургия', desc: 'Хирургия' },
          { title: 'Офтальмология', desc: 'Офтальмология' },
          { title: 'Неврология', desc: 'Неврология' },
          { title: 'Онкология', desc: 'Онкология' },
          { title: 'Урология', desc: 'Урология' },
          { title: 'Педиатрия', desc: 'Педиатрия' },
          { title: 'Акушерство и гинекология', desc: 'Акушерство и гинекология' },
          { title: 'Все специальности', desc: 'Все специальности', isMain: true },
        ],
      },
    }
  },

  computed: {
    sortedUserSpecialities() {
      const specialties = [...this.userSpecialities.options]
      const mainSpecialties = specialties.filter((spec) => spec.isMain)
      const notMainSpecialties = specialties
        .filter((spec) => !spec.isMain)
        .sort((a, b) => a.title.localeCompare(b.title))
      return [...mainSpecialties, ...notMainSpecialties]
    },
  },

  methods: {
    getChangeFilter(val) {
      this.$emit('change-filter', val)
    },
  },
}
</script>

<style lang="scss">
@import 'styles/components/common/app-action/app-action-rating-table';
</style>
