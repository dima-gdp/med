<template>
  <div class="registration-page">
    <div class="container">
      <div class="registration-page__title-block">
        <h1 class="h-1">Регистрация</h1>
        <div class="registration-title-block">
          <span class="t-p"> Уже зарегистрированы на сайте? </span>
          <nuxt-link to="/user/sign-in/login" class="t-b-l color--kiwi-green"> Войти </nuxt-link>
        </div>
      </div>
      <div class="b-h-4 md-b-h-6"></div>
      <ValidationObserver ref="registrationForm" tag="div">
        <div class="personal-data">
          <h3 class="h-3">Личные данные</h3>
          <div class="b-h-3 md-b-h-2 xs-b-h-2"></div>
          <div class="grid">
            <div class="personal-data__inputs g-c-1-5 md-g-c-1-8 xs-g-c-1-13">
              <ValidationProvider v-slot="{ errors }" :rules="{ required: true }" tag="div">
                <SInput
                  v-model="form.lastName"
                  class="personal-data__control--input"
                  placeholder="Фамилия *"
                  :error="!!errors.length"
                />
                <SErrorMessage :message="errors[0]" />
              </ValidationProvider>
              <ValidationProvider v-slot="{ errors }" :rules="{ required: true }" tag="div">
                <SInput
                  v-model="form.firstName"
                  class="personal-data__control--input"
                  placeholder="Имя *"
                  :error="!!errors.length"
                />
                <SErrorMessage :message="errors[0]" />
              </ValidationProvider>
              <SInput
                v-model="form.middleName"
                class="personal-data__control--input"
                placeholder="Отчество"
              />
            </div>
          </div>
        </div>
        <div class="b-h-12 md-b-h-10 xs-b-h-8"></div>
        <div class="professional-data">
          <h3 class="h-3">Ваша специальность</h3>
          <div class="b-h-3 md-b-h-2 xs-b-h-2"></div>
          <ValidationProvider
            v-slot="{ errors, validate }"
            :rules="{ specValidate: true }"
            tag="div"
          >
            <SpecialitySelector
              v-model="form.specs"
              :errors="errors"
              @input="validate"
              @leave="validate"
            />
          </ValidationProvider>
        </div>
        <div class="b-h-12 md-b-h-10 xs-b-h-8"></div>
        <div class="contact-data">
          <h3 class="h-3">Контактные данные</h3>
          <div class="b-h-1"></div>
          <p class="t-p">
            Чтобы завершить регистрацию на сайте Med.Studio, вам нужно подтвердить свой номер
            телефона и адрес электронной почты
          </p>
          <div class="b-h-4 md-b-h-4 xs-b-h-3"></div>
          <SRadioGroup v-model="fromRussia">
            <SRadioButton :val="true"> Я из России </SRadioButton>
            <SRadioButton :val="false"> Я не из России </SRadioButton>
          </SRadioGroup>
          <div class="b-h-5 md-b-h-3 xs-b-h-3"></div>
          <div class="grid contact-data__grid">
            <template v-if="fromRussia">
              <div class="g-c-1-5 md-g-c-1-8 xs-g-c-1-13">
                <ValidationProvider v-slot="{ errors }" rules="required" tag="div">
                  <SInput
                    v-model="form.phone"
                    placeholder="Ваш номер телефона *"
                    :error="!!errors.length || isPhoneInputDirty"
                  />
                  <SErrorMessage :message="errors[0]" />
                </ValidationProvider>
              </div>
              <div class="g-c-5-13 md-g-c-8-13 xs-g-c-1-13">
                <div class="d-f f-col justify-center" style="height: 100%">
                  <div class="contact-data__verify-phone">
                    <template v-if="!isPhoneConfirmed && !phoneBusy">
                      <div class="contact-data__text-info a-i-c">
                        <EvaIcon
                          class="contact-data__icon color--cool-grey"
                          name="close-circle-outline"
                        ></EvaIcon>
                        <div>Номер телефона не подтверждён</div>
                      </div>
                      <button
                        class="t-b-l color--kiwi-green g-c-1-3"
                        style="cursor: pointer"
                        @click="confirmPhone"
                      >
                        Подтвердить
                      </button>
                    </template>
                    <template v-if="phoneBusy">
                      <div class="contact-data__text-info">
                        <EvaIcon
                          class="contact-data__icon color--cool-grey"
                          name="close-circle-outline"
                        ></EvaIcon>
                        <div style="max-width: 433px">
                          Скорее всего вы уже зарегистрированы на нашем портале. Попробуйте
                          авторизоваться, нажав
                          <router-link
                            class="t-b-l color--kiwi-green g-c-1-3"
                            style="cursor: pointer"
                            to="/user/sign-in/login"
                          >
                            Войти
                          </router-link>
                        </div>
                      </div>
                    </template>
                    <template v-if="isPhoneConfirmed">
                      <div class="contact-data__text-info a-i-c">
                        <EvaIcon
                          class="contact-data__icon"
                          name="checkmark-circle-outline color--kiwi-green"
                        ></EvaIcon>
                        <span>Номер телефона подтверждён</span>
                      </div>
                    </template>
                  </div>
                </div>
              </div>
            </template>
            <AppVerificationModal
              v-model="isVerificationModalShown"
              :type="$options.METHODS_TOKEN_VERIFICATION.TEL"
              :contact="form.phone"
              :token-id="tokenId"
              :token-type="$options.TYPES_TOKEN_VERIFICATION.REGISTRATION"
              @verification-tel="successVerification"
              @set-token-id="setTokenId"
            />
            <div class="g-c-1-5 md-g-c-1-8 xs-g-c-1-13">
              <ValidationProvider v-slot="{ errors }" rules="required|email" tag="div">
                <SInput
                  v-model="form.email"
                  placeholder="Ваш e-mail *"
                  :error="!!errors.length"
                ></SInput>
                <SErrorMessage :message="errors[0]" />
              </ValidationProvider>
            </div>
            <div class="g-c-5-9 md-g-c-8-13 xs-g-c-1-13">
              <div class="t-c color--cool-grey">
                После регистрации вам придёт электронное письмо с&nbsp;ссылкой на подтверждение
                адреса электронной почты
              </div>
            </div>
          </div>
        </div>
        <div class="b-h-12 md-b-h-11 xs-b-h-6"></div>
        <div class="password-data">
          <h3 class="h-3">Пароль</h3>
          <div class="b-h-3 md-b-h-2 xs-b-h-2"></div>
          <div class="grid g-rg-3">
            <div class="g-c-1-5 md-g-c-1-8 xs-g-c-1-13">
              <ValidationProvider
                v-slot="{ errors }"
                :rules="{ required: true, min6: true }"
                name="password"
                tag="div"
              >
                <SInput
                  v-model="form.password"
                  type="password"
                  :error="!!errors.length"
                  placeholder="Придумайте пароль *"
                ></SInput>
                <SErrorMessage :message="errors[0]" />
              </ValidationProvider>
            </div>
            <div class="g-c-5-9 md-g-c-8-13 xs-d-none">
              <div class="t-c color--cool-grey">
                В целях безопасности пароль должен состоять как минимум из 6 символов
              </div>
            </div>
            <div class="g-c-1-5 md-g-c-1-8 xs-g-c-1-13">
              <ValidationProvider
                v-slot="{ errors }"
                :rules="{
                  required: true,
                  min6: true,
                  equalPassword: { otherPassword: '@password' },
                }"
                name="repeatPassword"
                tag="div"
              >
                <SInput
                  v-model="form.repeatPassword"
                  type="password"
                  :error="!!errors.length"
                  placeholder="Введите пароль ещё раз *"
                ></SInput>
                <SErrorMessage :message="errors[0]" />
              </ValidationProvider>
            </div>
          </div>
        </div>
        <div class="b-h-8 md-b-h-6 xs-b-h-3"></div>
        <div class="subscribe-data">
          <div class="subscribe-data__checkbox">
            <SCheckbox v-model="form.subscribe"></SCheckbox>
          </div>
          <div style="width: 14px"></div>
          <p class="t-p" style="cursor: pointer" @click="form.subscribe = !form.subscribe">
            Я даю согласие на получение информации об услугах в виде SMS и e-mail-сообщений
          </p>
        </div>
        <div class="b-h-2 md-b-h-2 xs-b-h-3"></div>
        <SButton :disabled="isLoading" @click="submitRegistration"> Зарегистрироваться </SButton>
        <div class="b-h-3 md-b-h-2 xs-b-h-2"></div>
      </ValidationObserver>
      <div class="t-c color--cool-grey">
        Нажимая на кнопку «Зарегистрироваться», вы подтверждаете, что
        <button class="color--kiwi-green" style="cursor: pointer" @click="openRulesModal = true">
          являетесь медицинским работником</button
        >, соглашаетесь с
        <a href="/page/agreement" target="_blank" class="color--kiwi-green"
          >Пользовательским соглашением</a
        >
        и даёте своё согласие Med.Studio на обработку персональной информации на условиях,
        определенных
        <a href="/page/personal-data-agreement" target="_blank" class="color--kiwi-green"
          >Политикой конфиденциальности</a
        >
      </div>
      <div class="b-h-12 md-b-h-8 xs-b-h-6"></div>
      <SDialog v-model="openRulesModal" scroll>
        <template #header>
          <h3 class="h-3">Уважаемые посетители портала Med.Studio</h3>
        </template>
        <div class="t-p" v-html="$options.MEDIC_TEXT_HTML"></div>
      </SDialog>
    </div>
  </div>
</template>

<script>
import {
  SErrorMessage,
  SButton,
  SCheckbox,
  SDialog,
  SInput,
  SRadioButton,
  SRadioGroup,
} from '@/components/ui-system'
import EvaIcon from '@/components/base/eva-icon'
import { MEDIC_TEXT_HTML } from '@/utils/long-texts'
import { ValidationProvider, ValidationObserver, extend } from 'vee-validate'
import { min } from 'vee-validate/dist/rules.umd'
import SpecialitySelector from '~/components/common/registration-components/speciality-selector'
import AppVerificationModal from '~/components/common/verification-modal/app-verification-modal'
import VerificationService from '~/domain/services/verification-service'
import HttpError from '~/domain/errors/http-error'
import useGlobalAlert from '~/domain/composables/useGlobalAlert'
import { METHODS_TOKEN_VERIFICATION, TYPES_TOKEN_VERIFICATION } from '~/utils/constants'
import TEXT from '~/components/common/verification-modal/verification-modal-text'
import useUser from '~/domain/composables/use-user'
import AuthService from '~/domain/services/auth-service/auth-service'

extend('specValidate', {
  validate: (value) => min.validate(value, { length: 2 }),
  message: 'Выберите вашу специальность!',
})

export default {
  MEDIC_TEXT_HTML,
  METHODS_TOKEN_VERIFICATION,
  TYPES_TOKEN_VERIFICATION,
  components: {
    SInput,
    SButton,
    SRadioButton,
    SRadioGroup,
    EvaIcon,
    SCheckbox,
    SDialog,
    SErrorMessage,
    ValidationProvider,
    ValidationObserver,
    SpecialitySelector,
    AppVerificationModal,
  },
  data() {
    return {
      fromRussia: true,
      form: {
        firstName: '',
        middleName: '',
        lastName: '',
        specs: [null],
        phone: '',
        email: '',
        password: '',
        repeatPassword: '',
        subscribe: false,
      },
      triedToVerifyPhone: false,
      confirmedPhone: null,
      tokenId: '',
      isLoading: false,
      isVerificationModalShown: false,
      openRulesModal: false,
      phoneBusy: false,
    }
  },
  computed: {
    isPhoneConfirmed() {
      return this.form.phone === this.confirmedPhone
    },
    isPhoneInputDirty() {
      return this.triedToVerifyPhone && !this.isPhoneConfirmed
    },
  },
  watch: {
    'form.phone'() {
      this.phoneBusy = false
    },
  },
  mounted() {
    if (this.$auth.isLoggedIn) {
      location.replace('/user/default/index')
    }
  },
  methods: {
    async submitRegistration() {
      const isValid = await this.$refs.registrationForm.validate()

      if (!isValid) {
        useGlobalAlert().createAlert('Пожалуйста, заполните обязательные поля!', 'error')
        return
      }
      this.isLoading = true

      try {
        await useUser().registerUser({
          firstName: this.form.firstName,
          middleName: this.form.middleName,
          lastName: this.form.lastName,
          specialityIds: this.form.specs.map((spec) => spec.id),
          email: this.form.email,
          fromRussia: this.fromRussia,
          phone: this.form.phone,
          tokenId: this.tokenId,
          password: this.form.password,
          subscribe: this.form.subscribe,
        })

        // запрос на authUser авторизует сразу в двух приложениях
        const authService = new AuthService(this.$store)
        await authService.authUser({ identity: this.form.email, password: this.form.password })
        await this.$router.push({ path: '/user/sign-in/complete-registration' })
      } catch (e) {
        if (e instanceof HttpError) {
          useGlobalAlert().createAlert(e.detailMessage, 'error')
        } else {
          console.error(e)
        }
      }

      this.isLoading = false
    },
    async confirmPhone() {
      const { createAlert } = useGlobalAlert()

      if (!this.form.phone) {
        createAlert('Введите телефон!', 'error')
        return
      }

      this.triedToVerifyPhone = true

      try {
        await this.processToken(this.form.phone)
      } catch (e) {
        if (e instanceof HttpError) {
          useGlobalAlert().createAlert(e.detailMessage, 'error')
          this.confirmPhoneErrorHandler(e)
        } else {
          console.error(e)
        }
      }
    },

    async processToken(phone) {
      const tokenId = await VerificationService.getToken(
        METHODS_TOKEN_VERIFICATION.TEL,
        phone,
        TYPES_TOKEN_VERIFICATION.REGISTRATION,
      )
      if (tokenId) {
        this.isVerificationModalShown = true
        this.tokenId = tokenId
      } else {
        useGlobalAlert().createAlert(TEXT.call.error, 'error')
      }
    },

    confirmPhoneErrorHandler(e) {
      if (e.errorCode === '4221') {
        this.phoneBusy = true
      }
    },

    successVerification() {
      this.isVerificationModalShown = false
      this.confirmedPhone = this.form.phone
    },

    setTokenId(tokenId) {
      this.tokenId = tokenId
    },
  },
}
</script>

<style lang="scss">
@import './styles/pages/signup';
</style>
