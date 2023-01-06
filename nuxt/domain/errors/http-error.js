export default class HttpError extends Error {
  type = 'http'
  constructor({ message, status, payload, request }) {
    super(message)
    this.message = message
    this.status = status
    this.payload = payload
    this.request = request
  }

  get detailMessage() {
    const [error] = this.payload?.errors || []
    return error?.detail
  }

  get errorCode() {
    const [error] = this.payload?.errors || []
    return error?.code
  }

  get requestPath() {
    // отличаются на сервере и на клиенте
    return this.request.path || this.request.responseURL
  }

  get shortErrorInfo() {
    return `
HTTP-ERROR: ${this.message}
REQUEST-PATH: ${this.requestPath}
    `
  }
}
