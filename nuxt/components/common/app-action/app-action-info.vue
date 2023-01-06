<template>
  <div class="action-info">
    <div class="action-info__flex">
      <div class="action-info__content content-action">
        <span class="content-action__badge">Программа лояльности</span>
        <h2 class="content-action__title h-1">Med.Studio Club</h2>
        <div class="content-action__image">
          <div class="action-bg">
            <div role="img"></div>
          </div>
        </div>
        <p class="content-action__subtitle t-p">
          С программой лояльности Med.Studio Club (MSC) ваши знания дарят подарки. Присоединяйтесь к
          программе, чтобы начать получать баллы за обучение на портале в самых популярных
          категориях: обучение онлайн – 10 баллов, просмотр материалов в архиве – 5 баллов,
          прослушивание подкастов – 5 баллов. Чем активнее вы пользуетесь образовательными
          возможностями портала, тем больше баллов вы получаете – и тем выше ваш уровень в рейтинге
          участников. Вступайте в программу, чтобы копить знания и получать подарки! Вход в
          программу бесплатный и абсолютно добровольный.
        </p>
        <div class="content-action__bot">
          <AppActionJoin
            :is-participant-action="isParticipantAction"
            @change-status-action="$emit('change-status-action')"
            @click-terms-btn="$emit('click-terms-btn')"
          />
        </div>
      </div>
      <div class="action-info__image">
        <div class="action-bg">
          <div role="img"></div>
        </div>
      </div>
    </div>
    <div class="action-info__bot">
      <AppActionJoin
        :is-participant-action="isParticipantAction"
        @change-status-action="$emit('change-status-action')"
        @click-terms-btn="$emit('click-terms-btn')"
      />
    </div>
  </div>
</template>

<script>
import AppActionJoin from '~/components/common/app-action/app-action-join'

export default {
  components: { AppActionJoin },
  props: {
    isParticipantAction: { type: Boolean, default: false },
  },
}
</script>

<style lang="scss">
@import 'styles/components/common/app-action/app-action-info';
</style>
