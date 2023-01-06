import { BREAKPOINT_NAMES } from '~/utils/constants'

const TAB_NAMES = {
  rules: {
    shortName: 'Правила',
    fullName: 'Правила программы',
  },
  rating: {
    shortName: 'Рейтинг',
    fullName: 'Рейтинг участников',
  },
}

export default class userService {
  /**
   * Возвращает список юзеров для таблицы
   * @param {Array} usersList
   * @returns {array}
   */
  static getConvertedUsersList(usersList) {
    return usersList.map((user) => {
      return {
        rank: user.rank,
        rate: user.rate,
        fullName: this.getFullUserName(user?.userProfile),
      }
    })
  }

  /**
   * Возвращает данные о юзере и его рейтинге
   * @param {Array} userRank
   * @param {Object} user
   * @returns {Object}
   */
  static getUserActionInfo(userRank, user) {
    return {
      isParticipantAction: user.hasPromo,
      fullName: this.getFullUserName(user.profile),
      userRank: this.getUserRank(userRank),
    }
  }

  /**
   * Возвращает данные о рейтинге юзера
   * @param {Array} userRank
   * @returns {Array}
   */

  static getUserRank(userRank) {
    return userRank.map((userInfo) => {
      return {
        rate: userInfo.rate,
        rank: userInfo.rank,
        fullName: this.getFullUserName(userInfo?.userProfile),
        nomination: userInfo.name,
      }
    })
  }

  /**
   * Возвращает полное имя юзера
   * @param {Object} user
   * @returns {string}
   */
  static getFullUserName(user) {
    return `${user?.lastName} ${user?.firstName} ${user?.middleName}`
  }

  /**
   * Возвращает название таба правил
   * @param {string} currentBreakpoint
   * @returns {string}
   */
  static getRulesTabName(currentBreakpoint) {
    return currentBreakpoint === BREAKPOINT_NAMES.MOBILE
      ? TAB_NAMES.rules.shortName
      : TAB_NAMES.rules.fullName
  }

  /**
   * Возвращает название таба рейтинга
   * @param {string} currentBreakpoint
   * @returns {string}
   */
  static getRatingTabName(currentBreakpoint) {
    return currentBreakpoint === BREAKPOINT_NAMES.MOBILE
      ? TAB_NAMES.rating.shortName
      : TAB_NAMES.rating.fullName
  }
}
