export default class EntityUser {
  constructor(userData) {
    if (!userData) {
      throw new TypeError('[entity-user]: получена пустая userData')
    }
    this._apiData = userData
  }

  _getFullName() {
    return [this._apiData?.profile?.firstName, this._apiData?.profile?.lastName].join(' ').trim()
  }

  getPublicIdentity() {
    return this._getFullName() || this._apiData.email
  }
}
