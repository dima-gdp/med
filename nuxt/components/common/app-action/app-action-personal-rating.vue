<template>
  <div>
    <div v-if="user.isParticipantAction">
      <div v-if="user.userRank.length">
        <div v-for="(userInfo, idx) in user.userRank" :key="idx" class="personal-rating">
          <div class="personal-rating__position">{{ userInfo.rank }}</div>
          <span class="personal-rating__name">{{ userInfo.fullName }}</span>
          <div class="personal-rating__nomination">Ваш рейтинг: «{{ userInfo.nomination }}»</div>
          <div class="personal-rating__info">Обновляется 1 раз в сутки</div>
        </div>
      </div>
      <div v-else>
        <div class="personal-rating">
          <div class="personal-rating__position">0</div>
          <span class="personal-rating__name">{{ user.fullName }}</span>
          <div class="personal-rating__nomination">Вы участвуете в рейтинге</div>
          <div class="personal-rating__info">Обновляется 1 раз в сутки</div>
        </div>
      </div>
    </div>
    <div v-else>
      <div class="personal-rating">
        <span class="personal-rating__name">{{ user.fullName  }}</span>
        <div class="personal-rating__nomination">Вы еще не участвуете в рейтинге</div>
        <div class="personal-rating__info">Обновляется 1 раз в сутки</div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  props: {
    user: { type: Object, default: () => ({}) },
  },
}
</script>

<style lang="scss">
@import 'styles/components/common/app-action/app-action-personal-rating';
</style>
