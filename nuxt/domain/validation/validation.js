import { extend, setInteractionMode } from 'vee-validate'
import { email, is, min, required } from 'vee-validate/dist/rules.umd.js'
export function setupValidation() {
  setInteractionMode('lazy')
  extend('required', {
    ...required,
    message: 'Это поле обязательно',
  })

  extend('email', {
    ...email,
    message: 'Адрес электронной почты может содержать только латинские буквы, цифры и знак @',
  })

  extend('min6', {
    // чтобы не передавать параметр в темплейте как в доке, что не плохо, просто показываю варианты
    validate: (value) => min.validate(value, { length: 6 }),
    message: 'Введите минимум 6 символов',
  })

  extend('password', {
    validate: (value) => {
      return /\d/.test(value) && /[a-zA-z]/.test(value)
    },
    message: 'Пароль должен содержать минимум одну цифру и латинскую букву',
  })

  extend('equalPassword', {
    params: ['otherPassword'],
    validate(value, { otherPassword }) {
      return is.validate(value, { other: otherPassword })
    },
    message: 'Пароли не совпадают',
  })
}
