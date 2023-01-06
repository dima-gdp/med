<template>
  <div class="body">
    <div class="container">
      <div class="error">
        <header class="layout__header header">
          <img src="/static/svg/logo.svg" alt="logo" class="header__img" />
        </header>
        <main class="layout__content content">
          <div class="content__error-code sp-e-code">
            {{ error.statusCode }}
          </div>
          <h1 class="content__title sp-b-h">Что-то пошло не так</h1>
          <div class="content__description t-p">
            Страница, на которую вы хотите перейти, сломалась, и скорее всего мы уже пытаемся её
            починить. Попробуйте подождать несколько минут и перезагрузить её.
          </div>
        </main>
      </div>
    </div>
  </div>
</template>

<script>
import { ENV_NAMES } from '~/build-vars'

export default {
  layout: 'empty',
  // eslint-disable-next-line vue/require-prop-types
  props: ['error'],
  created() {
    console.error(this.error)
    if (this.error.statusCode === 500 && process.env.ENV === ENV_NAMES.PROD) {
      location.assign('/500.html')
    }
  },
}
</script>
<!-- scoped специально (пересечения с layout и app-header) -->
<style lang="scss" scoped>
.body {
  height: 100vh;
  //background: #252D33;
  //color: #94A9B7;
  background: $color-neutral-cobalt-black;
  color: $color-neutral-cool-grey;
  @include font-regular;

  overflow-y: hidden;
  //font-family: PT-Root-UI, serif;
}

.container {
  margin: 0 auto;
  width: 100%;
  max-width: 792px;

  @media (max-width: 991px) {
    max-width: 792px;
  }
  @media (max-width: 767px) {
    max-width: 300px;
  }
}

.header {
  padding-top: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.content {
  margin-top: 115px;
  display: flex;
  flex-direction: column;
  align-items: center;

  @media (max-width: 991px) {
    margin-top: 105px;
  }
  @media (max-width: 767px) {
    margin-top: 50px;
  }

  &__error-code {
    color: $color-neutral-snow-white;
  }

  &__title {
    margin: 0;
    text-align: center;
  }

  &__description {
    margin-top: 52px;
    text-align: center;

    @media (max-width: 991px) {
      margin-top: 41px;
    }
    @media (max-width: 767px) {
      margin-top: 25px;
    }
  }
}
</style>
