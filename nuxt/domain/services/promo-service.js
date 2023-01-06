export const PROMO_ALERT_MAX_AGE = 1209600
export const PROMO_VISIBLE_KEY = 'isActionAlertClosed'


/**
 * Определяет показывать ли промо-акцию
 * @param {Boolean} hasPromo - пользователь участвует в акции
 * @param {Boolean} isClosed - скрыта ли акция
 * @returns {Boolean}
 */
export function isPromoVisible(hasPromo, isClosed) {
  return !hasPromo && !isClosed
}
