const Joi = require('joi')
const { ApiErrorFailure } = require('../../../../errors/api-error-failure')
const { saveCdoTaskDetails } = require('../../../../api/ddi-index-api/cdo')

const mapBoomError = (e) => {
  const message = e.boom.payload.message

  return new Joi.ValidationError(message, [{ message, path: ['generalError'], type: 'custom' }])
}

const issueCertTask = async (indexNumber, user) => {
  try {
    await saveCdoTaskDetails(indexNumber, 'issueCertificate', {}, user)

    return null
  } catch (e) {
    if (e instanceof ApiErrorFailure) {
      return mapBoomError(e)
    }

    throw e
  }
}

module.exports = {
  issueCertTask
}
