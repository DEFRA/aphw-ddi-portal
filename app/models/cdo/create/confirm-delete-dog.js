const { routes, keys } = require('../../../constants/cdo/dog')
const { formatToGds } = require('../../../lib/date-helpers')

function ViewModel (dog) {
  this.model = {
    formAction: routes.delete.post,
    backLink: routes.confirm.get,
    dog: {
      id: dog.id,
      name: dog[keys.name],
      breed: dog[keys.breed],
      cdoIssued: formatToGds(dog[keys.cdoIssued]),
      cdoExpiry: formatToGds(dog[keys.cdoExpiry])
    }
  }
}

module.exports = ViewModel
