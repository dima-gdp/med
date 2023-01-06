<template>
  <div class="rating">
    <STabs v-model="activeTab" class="rating__tabs">
      <STabItem :title="rating">
        <AppActionRatingTable
          :users-list="usersList"
          :user="user"
          @change-filter="$emit('change-filter', $event)"
        />
      </STabItem>
      <STabItem :title="rules">
        <AppActionPromotionRules :user="user" />
      </STabItem>
    </STabs>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { STabs, STabItem } from '~/components/ui-system'
import AppActionPromotionRules from '~/components/common/app-action/app-action-promotion-rules'
import AppActionRatingTable from '~/components/common/app-action/app-action-rating-table'
import UserService from '~/domain/services/user-service'

export default {
  components: {
    AppActionRatingTable,
    AppActionPromotionRules,
    STabs,
    STabItem,
  },

  props: {
    usersList: { type: Array, default: () => [] },
    user: { type: Object, default: () => ({}) },
    value: { type: Number, default: 0 },
  },

  computed: {
    ...mapState(['currentBreakpoint']),

    activeTab: {
      get() {
        return this.value
      },

      set(val) {
        this.$emit('input', val)
      }
    },

    rules() {
      return UserService.getRulesTabName(this.currentBreakpoint)
    },

    rating() {
      return UserService.getRatingTabName(this.currentBreakpoint)
    },
  },
}
</script>

<style lang="scss">
@import 'styles/components/common/app-action/app-action-rating';
</style>
