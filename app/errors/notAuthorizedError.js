function NotAuthorizedError (message) {
  this.name = 'ResourceNotFoundError'
  this.message = message
  this.stack = (new Error()).stack
}
NotAuthorizedError.prototype = Object.create(Error.prototype)
NotAuthorizedError.prototype.name = 'NotAuthorizedError'

module.exports = { NotAuthorizedError }
