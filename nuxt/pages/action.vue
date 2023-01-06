<template>
  <main class="action">
    <SSpin v-if="isLoading" />
    <div v-else class="action__container container">
      <div class="action__info">
        <AppActionInfo
          :is-participant-action="user.isParticipantAction"
          @change-status-action="changeStatusAction"
          @click-terms-btn="onClickTermsBtn"
        />
      </div>
      <div class="action__partner">
        <AppActionPartner />
      </div>

      <div class="action__rating" ref="rating">
        <AppActionRating
          v-model="activeTab"
          :users-list="usersList"
          :user="user"
          @change-filter="changeFilter"
        />
      </div>
    </div>
  </main>
</template>

<script>
import { mapState } from 'vuex'
import AppActionInfo from '~/components/common/app-action/app-action-info'
import AppActionRating from '~/components/common/app-action/app-action-rating'
import AppActionPartner from '~/components/common/app-action/app-action-partner'
import UserService from '~/domain/services/user-service'
import useUser from '~/domain/composables/use-user'
import SSpin from '~/components/ui-system/s-spin/s-spin'

export default {
  components: { SSpin, AppActionRating, AppActionInfo, AppActionPartner },

  middleware: ['redirect-not-logged-in'],

  data() {
    return {
      activeTab: 0,
      usersList: [],
      user: {},
      isLoading: false,
      filterUsersList: {
        filter: { name: 'Все специальности' },
        sort: 'rank',
        include: 'user,userProfile',
        pageCount: 1,
        perPage: 10,
      },
      filterUser: {
        filter: { userId: null, name: 'Все специальности' },
        include: 'user,userProfile',
      },
    }
  },

  computed: {
    ...mapState({
      userId: (state) => state.user.userId,
    }),
  },

  async created() {
    try {
      this.isLoading = true
      this.filterUser.filter.userId = this.userId
      await this.setUsersInfo()
    } catch (e) {
      console.error(e)
    } finally {
      this.isLoading = false
    }
  },

  methods: {
    async setUsersInfo() {
      const [user, usersList, userRank] = await Promise.all([
        useUser().fetchUserById(this.userId),
        useUser().getUserRank(this.filterUsersList),
        useUser().getUserRank(this.filterUser),
      ])

      this.usersList = UserService.getConvertedUsersList(usersList)
      this.user = UserService.getUserActionInfo(userRank, user)
    },

    async changeFilter(filter) {
      try {
        this.filterUsersList.filter.name = filter
        this.filterUser.filter.name = filter
        await this.setUsersInfo()
      } catch (e) {
        console.error(e)
      }
    },

    async changeStatusAction() {
      try {
        const params = {
          hasPromo: true,
        }
        await useUser().updateUser(this.userId, params)
        this.$store.commit('user/SET_USER_PROMO', true)
        await this.setUsersInfo()
      } catch (e) {
        console.error(e)
      }
    },

    onClickTermsBtn() {
      const scrollTop = this.$refs.rating.offsetTop - 30
      this.activeTab = 1
      window.scrollTo({
        top: scrollTop,
        behavior: 'smooth',
      })
    },
  },
}
</script>

<style lang="scss">
.action {
  &__container {
    padding-top: 16px;

    @include media-breakpoint-up(md) {
      padding-top: 32px;
    }

    @include media-breakpoint-up(xl) {
      padding-top: 74px;
    }
  }

  &__partner {
    margin-top: 41px;

    @include media-breakpoint-up(md) {
      margin-top: 58px;
    }

    @include media-breakpoint-up(xl) {
      margin-top: 110px;
    }
  }

  &__rating {
    margin: 120px 0 59px 0;

    @include media-breakpoint-up(md) {
      margin: 110px 0 54px 0;
    }

    @include media-breakpoint-up(xl) {
      margin: 120px 0 59px 0;
    }
  }
}
</style>
