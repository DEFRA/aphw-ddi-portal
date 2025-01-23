const { extractLatestAddress, formatAddressAsArray, extractEmail } = require('../../../lib/model-helpers')

function ViewModel (details, backNav) {
  this.model = {
    actionLink: backNav.actionLink,
    indexNumber: details.cdo.dog.indexNumber,
    sendOption: details.sendOption,
    email: extractEmail(details.cdo.person.person_contacts),
    name: `${details.cdo.person.firstName} ${details.cdo.person.lastName}`,
    addressArray: formatAddressAsArray(extractLatestAddress(details.cdo.person.addresses))
  }
}

module.exports = ViewModel
