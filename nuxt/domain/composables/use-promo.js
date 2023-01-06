import CookieAdapter from '~/utils/cookie-adapter'
import { PROMO_ALERT_MAX_AGE, PROMO_VISIBLE_KEY } from '~/domain/services/promo-service'

export default function usePromo() {
  function setCookiePromoClosed() {
    document.cookie = CookieAdapter.cookieSerialize({
      key: PROMO_VISIBLE_KEY,
      value: true,
      options: { path: '/', maxAge: PROMO_ALERT_MAX_AGE },
    })

    return true
  }

  return {
    setCookiePromoClosed,
  }
}
