const { routes: ownerRoutes } = require('../../../constants/owner')
const { formatToGds } = require('../../../lib/date-helpers')
const { extractEmail, extractTelephoneNumbers } = require('../../../lib/model-helpers')

function ViewModel (personAndDogs) {
  this.model = {
    backLink: ownerRoutes.home.get,
    person: {
      id: personAndDogs.id,
      personReference: personAndDogs.personReference,
      firstName: personAndDogs.firstName,
      lastName: personAndDogs.lastName,
      dateOfBirth: formatToGds(personAndDogs.birthDate),
      addressLines: [].concat(personAndDogs.address.addressLine1, personAndDogs.address.addressLine2, personAndDogs.address.town, personAndDogs.address.postcode).filter(el => el != null),
      country: personAndDogs?.address?.country,
      email: extractEmail(personAndDogs?.contacts),
      telephoneNumbers: extractTelephoneNumbers(personAndDogs?.contacts)
    },
    dogs: personAndDogs.dogs
  }
}

module.exports = ViewModel
