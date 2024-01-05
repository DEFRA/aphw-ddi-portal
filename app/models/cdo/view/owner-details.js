const { routes: ownerRoutes } = require('../../../constants/owner')
const { formatToGds } = require('../../../lib/date-helpers')
const { extractEmail, extractLatestPrimaryTelephoneNumber, extractLatestSecondaryTelephoneNumber, formatAddressAsArray } = require('../../../lib/model-helpers')
const { addBackNavigation } = require('../../../lib/back-helpers')

function ViewModel (personAndDogs, request) {
  this.model = {
    person: {
      id: personAndDogs.id,
      personReference: personAndDogs.personReference,
      firstName: personAndDogs.firstName,
      lastName: personAndDogs.lastName,
      dateOfBirth: formatToGds(personAndDogs.birthDate),
      addressLines: formatAddressAsArray(personAndDogs.address),
      country: personAndDogs?.address?.country,
      email: extractEmail(personAndDogs?.contacts),
      telephoneNumber1: extractLatestPrimaryTelephoneNumber(personAndDogs?.contacts),
      telephoneNumber2: extractLatestSecondaryTelephoneNumber(personAndDogs?.contacts),
      navlink: {
        url: ownerRoutes.editDetails.get,
        text: 'Edit details'
      }
    },
    dogs: personAndDogs.dogs
  }
  addBackNavigation(this.model, request)
}

module.exports = ViewModel
