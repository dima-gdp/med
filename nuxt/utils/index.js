import cookie from 'cookie'
import luxon from '~/plugins/luxon'
import { MONTH_NAMES } from '~/utils/constants'

export const kebabToCamel = (str) => str.replace(/-([a-z])/g, (g) => g[1].toUpperCase())
export const snakeToCamel = (str) => str.replace(/_([a-z])/g, (g) => g[1].toUpperCase())
export const camelToKebab = (str) => str.replace(/([A-Z])/g, (g) => `-${g.toLowerCase()}`)

export function camelize(entry) {
  const toCamelPiped = (s) => kebabToCamel(snakeToCamel(s))

  if (Array.isArray(entry)) {
    return entry.map((e) => camelize(e))
  }
  if (!isComplexType(entry)) {
    return entry
  }
  return Object.entries(entry).reduce((accum, [key, value]) => {
    accum[toCamelPiped(key)] = isComplexType(value) ? camelize(value) : value
    return accum
  }, {})
}

/**
 * @deprecated использовать cookie.parse
 * @param cookieStr
 * @returns {undefined|*}
 */
export function parseCookie(cookieStr) {
  if (!cookieStr) {
    return undefined
  }
  return cookie.parse(cookieStr)
}

export function isComplexType(something) {
  const strView = Object.prototype.toString.call(something)
  return ['[object Object]', '[object Array]'].includes(strView)
}

export function isObject(something) {
  const strView = Object.prototype.toString.call(something)
  return ['[object Object]'].includes(strView)
}

export function roundElementWidth(element) {
  const width = parseInt(getComputedStyle(element).width)
  element.setAttribute('style', `width: ${width + 1}px`)
}

export function decOfNum(number, titles) {
  const num = Math.floor(number)
  const cases = [2, 0, 1, 1, 1, 2]
  return titles[num % 100 > 4 && num % 100 < 20 ? 2 : cases[num % 10 < 5 ? num % 10 : 5]]
}

export function throttle(f, ms) {
  let isCoolDown = false

  return function (...args) {
    if (isCoolDown) return

    f.apply(this, args)

    isCoolDown = true

    setTimeout(() => {
      isCoolDown = false
    }, ms)
  }
}

export function debounce(func, ms, immediate) {
  let timeout

  return function executedFunction() {
    const context = this
    const args = arguments

    const later = function () {
      timeout = null
      if (!immediate) func.apply(context, args)
    }

    const callNow = immediate && !timeout

    clearTimeout(timeout)

    timeout = setTimeout(later, ms)

    if (callNow) func.apply(context, args)
  }
}

export function fromStampToString(stamp) {
  const dateSplit = luxon.DateTime.fromSeconds(+stamp)
    .toFormat('d M yyyy')
    .split(' ')
  const monthString = MONTH_NAMES[dateSplit[1] - 1]
  dateSplit[1] = monthString
  const dateString = dateSplit.join(' ')
  return dateString
}
