export default function useLogin() {
  /**
   * Редиректит назад
   * @param {object} router - vue router
   * @param {string} referrer
   * @param {object} location - текущий url
   */
  async function navigateByReferrer(router, referrer, location) {
    if (new URL(referrer).hostname === location.hostname) {
      window.location.href = referrer
    } else {
      await router.push({ path: '/' })
    }
  }

  /**
   * Редиректит назад
   * @param {Object} params
   * @param {string} params.referrer
   * @param {object} params.router - vue router
   * @param {object} params.query - route query
   * @param {object|string} params.from - router.from
   * @param {object} params.location - текущий url
   */
  async function navigateBack({ referrer, router, query, from, location }) {
    // возможно определение backUrl стоит вынести в абстракцию
    if (referrer) {
      await navigateByReferrer(router, referrer, location)
    } else if (from) {
      await router.push(from)
    } else if (query.from) {
      window.location.href = query.from
    } else {
      await router.push({ path: '/' })
    }
  }

  return {
    navigateBack,
  }
}
