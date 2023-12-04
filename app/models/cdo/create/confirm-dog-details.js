const { routes, keys } = require('../../../constants/cdo/dog')
const { formatToGds } = require('../../../lib/date-helpers')

function ViewModel(dogs) {  
  this.model = {
    formAction: routes.confirm.post,
    backLink: routes.details.get,
    dogs: dogs.map((dog, index) => ({
      heading: `Dog ${index + 1}`,
      name: dog[keys.name],
      breed: dog[keys.breed],
      cdoIssued: formatToGds(dog[keys.cdoIssued]),
      cdoExpiry: formatToGds(dog[keys.cdoExpiry])
    }))
  }
}

module.exports = ViewModel
