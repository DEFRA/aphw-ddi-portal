const { keys, routes } = require('../../../constants/admin')
const { errorPusherWithDate } = require('../../../lib/error-helpers')
const { constructDateField } = require('../../../lib/model-helpers')

const getFieldLabel = (queryType) => {
  if (queryType === 'user') {
    return 'Username'
  } else if (queryType === 'search') {
    return 'Search term'
  } else if (queryType === 'dog') {
    return 'Dog index number'
  } else if (queryType === 'owner') {
    return 'Owner reference'
  }
}

function ViewModel (details, errors) {
  this.model = {
    backLink: routes.auditQueryType.get,
    queryType: details.queryType,
    queryTypeText: details.queryTypeText,
    fromDate: constructDateField(details, keys.fromDate, 'Start date'),
    toDate: constructDateField(details, keys.toDate, 'End date'),
    pk: {
      id: 'pk',
      name: 'pk',
      label: {
        text: getFieldLabel(details.queryType),
        classes: 'govuk-!-font-weight-bold'
      },
      value: details?.pk
    },
    errors: []
  }

  errorPusherWithDate(errors, this.model)
}

module.exports = ViewModel
