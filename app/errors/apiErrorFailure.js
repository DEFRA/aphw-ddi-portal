function ApiErrorFailure (message, boom) {
  this.name = 'ApiErrorFailure'
  this.message = message
  this.stack = (new Error()).stack
  this.boom = boom
}
ApiErrorFailure.prototype = Object.create(Error.prototype)
ApiErrorFailure.prototype.name = 'ApiErrorFailure'

module.exports = { ApiErrorFailure }
