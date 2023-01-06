<template>
  <div class="validation-page">
    <div style="height: 200px"></div>
    <ValidationProvider v-slot="{ errors, failed }" :rules="{ required: true }" mode="lazy">
      <SInput
        v-model="inputValue"
        append-icon="checkmark-circle-outline"
        :placeholder="'Введите имя *'"
        :status="failed ? 'error' : 'default'"
      />
      <SErrorMessage :message="errors[0]" />
    </ValidationProvider>

    <div style="height: 50px"></div>
    <!--  html-форма (заморачиваться с ней не обязательно)-->
    <ValidationObserver v-slot="{ passed }">
      <form class="test-form" @submit.prevent="" @keypress.enter="sendData(passed)">
        <ValidationProvider v-slot="{ errors, failed }" :rules="{ email: true }">
          <SInput
            v-model="form.email"
            append-icon="checkmark-circle-outline"
            :placeholder="'Введите почту *'"
            :error="failed"
          />
          <SErrorMessage :message="errors[0]" class="extend-error-message-position" />
        </ValidationProvider>
        <ValidationProvider v-slot="{ errors, failed }" :rules="{ required: true }">
          <SInput
            v-model="form.name"
            append-icon="checkmark-circle-outline"
            :placeholder="'Введите имя'"
            :error="failed"
          />
          <SErrorMessage :message="errors[0]" />
        </ValidationProvider>
        <ValidationProvider
          v-slot="{ errors, failed }"
          :rules="{ required: true, min6: true, password: true }"
        >
          <SInput
            v-model="form.password"
            append-icon="checkmark-circle-outline"
            :placeholder="'Введите пароль *'"
            :error="failed"
          />
          <SErrorMessage :message="errors[0]" />
        </ValidationProvider>
        <SButton compressed :disabled="!passed" @click="sendData(passed)"> САМБИТ! </SButton>
      </form>
    </ValidationObserver>
  </div>
</template>

<script>
import { ValidationProvider, ValidationObserver } from 'vee-validate'
import { SErrorMessage, SInput, SButton } from '~/components/ui-system'

export default {
  components: {
    SInput,
    ValidationProvider,
    SErrorMessage,
    ValidationObserver,
    SButton,
  },
  layout: 'empty',
  data() {
    return {
      inputValue: '',
      form: {
        name: '',
        email: '',
        password: '',
      },
    }
  },
  methods: {
    sendData(isFormValid) {
      if (!isFormValid) {
        return
      }
      alert(JSON.stringify(this.form))
    },
  },
}
</script>

<style lang="scss">
.validation-page {
  max-width: 1200px;
  margin: 0 auto;
}
.test-form {
  max-width: 500px;
  margin: 0 auto;

  display: grid;
  row-gap: 30px;
}

.extend-error-message-position {
  // см .s-error-message
  @include media-breakpoint-up(xl) {
    margin-left: -20px;
    padding: 0 !important;
  }
}
</style>
