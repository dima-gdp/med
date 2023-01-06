import { nanoid } from 'nanoid'
import { reactive } from '@nuxtjs/composition-api'

type AlertType = 'error' | 'warning' | 'success' | 'info'

type AlertTime = number | null

type AlertMessage = string | number

type AlertState = {
  isShown: boolean
  message: AlertMessage
  type: AlertType
  time: AlertTime
  id: string
  timer: number
}

const initialAlertState: AlertState[] = []

const alertState = reactive(initialAlertState)

/**
 * Очередные эксперименты (по идее это часть Application State и должен использоваться Vuex)
 * а возможно вообще сторонняя библиотека
 */
export default function () {
  function createAlert(message: AlertMessage, type: AlertType = 'info', time: AlertTime = 3000) {
    if (!['string', 'number'].includes(typeof message)) {
      throw new TypeError('Неверный тип message')
    }
    if (!['error', 'warning', 'success', 'info'].includes(type)) {
      throw new TypeError('Неверный тип type')
    }

    // typeof null === object
    if (typeof time !== 'number' && time !== null) {
      throw new TypeError('Неверный тип time')
    }

    const newId = nanoid()
    const newAlert = {
      message,
      type,
      time,
      id: newId,
      isShown: true,
      timer: (time
        ? setTimeout(() => {
            hideAlert(newId)
          }, time)
        : 0) as number,
    }
    alertState.push(newAlert)

    return newAlert
  }

  function findAlert(id: string): AlertState {
    const alert = alertState.find((alert) => alert.id === id)

    if (!alert) {
      throw new Error('useGlobalAlert: не найден id')
    }

    return alert
  }

  function hideAlert(id: string) {
    const alert = findAlert(id)

    alert.timer && clearTimeout(alert.timer)
    alert.isShown = false

    alertState.forEach((a) => {
      if (a.id === id) {
        const index = alertState.findIndex((item) => item.id === id)
        // перерисовывает весь массив после удаленного элемента,
        // возможно можно придумать что-нибудь производительнее
        alertState.splice(index, 1)
      }
    })
  }

  function getAlertState() {
    return alertState
  }

  return {
    createAlert,
    hideAlert,
    getAlertState,
  }
}
