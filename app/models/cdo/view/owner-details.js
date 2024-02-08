const { routes: ownerRoutes } = require('../../../constants/cdo/owner')
const { formatToGds } = require('../../../lib/date-helpers')
const { extractEmail, extractLatestPrimaryTelephoneNumber, extractLatestSecondaryTelephoneNumber, formatAddressAsArray } = require('../../../lib/model-helpers')

function ViewModel (personAndDogs, backNav) {
  this.model = {
    backLink: backNav.backLink,
    srcHashParam: backNav.srcHashParam,
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
}

module.exports = ViewModel
