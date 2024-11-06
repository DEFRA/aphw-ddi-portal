const { auditQueryTypes } = require('../../../constants/admin')
const { errorPusherDefault } = require('../../../lib/error-helpers')

function ViewModel (details, errors) {
  this.model = {
    queryType: {
      id: 'queryType',
      name: 'queryType',
      classes: 'govuk-!-font-size-16',
      items: auditQueryTypes,
      value: details?.queryType
    },
    errors: []
  }

  errorPusherDefault(errors, this.model)
}

module.exports = ViewModel
