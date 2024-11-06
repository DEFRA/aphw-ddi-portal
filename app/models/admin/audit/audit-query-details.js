const { keys, routes, auditQueryTypes } = require('../../../constants/admin')
const { errorPusherWithDate } = require('../../../lib/error-helpers')
const { constructDateField } = require('../../../lib/model-helpers')
const { formatToDateTimeConcise } = require('../../../lib/date-helpers')
const { getFieldHint, getFieldLabel, getExtraColumnFunctions, getExtraColumnNames, eitherDateIsPopulated, getNumberFoundText } = require('../../../lib/audit-query-helpers')

const showPkFieldForTypes = ['dog', 'owner', 'user', 'search']

function ViewModel (details, errors) {
  this.model = {
    backLink: routes.auditQueryType.get,
    queryType: details.queryType,
    queryTypeText: auditQueryTypes.find(x => x.value === details?.queryType)?.text,
    numberFoundText: getNumberFoundText(details?.results),
    showPkField: showPkFieldForTypes.includes(details?.queryType),
    expandDateDetails: eitherDateIsPopulated(details),
    extraColumnFns: getExtraColumnFunctions(details?.queryType),
    extraColumnNames: getExtraColumnNames(details?.queryType),
    formatTimestamp: formatToDateTimeConcise,
    fromDate: constructDateField(details, keys.fromDate, 'Start date (optional)'),
    toDate: constructDateField(details, keys.toDate, 'End date (optional)'),
    pk: {
      id: 'pk',
      name: 'pk',
      label: {
        text: getFieldLabel(details.queryType),
        classes: 'govuk-!-font-weight-bold'
      },
      hint: {
        text: getFieldHint(details.queryType)
      },
      value: details?.pk
    },
    results: details?.results,
    errors: []
  }

  errorPusherWithDate(errors, this.model)
}

module.exports = ViewModel
