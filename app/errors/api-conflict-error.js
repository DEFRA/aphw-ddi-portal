const { ApiErrorFailure } = require('./api-error-failure')

function ApiConflictError (apiErrorFailure) {
  this.apiErrorFailure = apiErrorFailure
  this.name = 'ApiConflictError'
  this.message = this.apiErrorFailure.message
  this.stack = (new Error()).stack
  this.boom = this.apiErrorFailure.boom
}
ApiConflictError.prototype = Object.create(ApiErrorFailure.prototype)
ApiConflictError.prototype.name = 'ApiConflictError'

module.exports = { ApiConflictError }
