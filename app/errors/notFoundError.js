function NotFoundError (message) {
  this.name = 'NotFoundError'
  this.message = message
  this.stack = (new Error()).stack
}
NotFoundError.prototype = Object.create(Error.prototype)
NotFoundError.prototype.name = 'NotFoundError'

module.exports = { NotFoundError }
