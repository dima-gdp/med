<template>
  <div class="action-join">
    <SButton
      v-if="isParticipantAction"
      class="action-join__join-btn"
      icon="left"
      icon-name="checkmark-circle-outline"
      disabled
      >Вы уже участник этой акции</SButton
    >
    <SButton
      v-else
      class="action-join__join-btn"
      icon="left"
      icon-name="checkmark-circle-outline"
      @click="$emit('change-status-action')"
      >Стать участником</SButton
    >
    <div v-if="!isParticipantAction" class="action-join__privacy t-c">
      Нажимая на кнопку «Стать участником», вы соглашаетесь с
      <button @click="$emit('click-terms-btn')">Правилами программы лояльности</button>
    </div>
  </div>
</template>

<script>
import SButton from '~/components/ui-system/s-button/s-button'

export default {
  components: { SButton },
  props: {
    isParticipantAction: { type: Boolean, default: false },
  },
}
</script>
