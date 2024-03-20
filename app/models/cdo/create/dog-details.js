const { routes } = require('../../../constants/cdo/dog')
const { keys } = require('../../../constants/cdo/dog')
const { errorPusherWithDate } = require('../../../lib/error-helpers')
const { applicationTypeElements } = require('../common/components/application-type')

function ViewModel (dogDetails, breedTypes, errors) {
  this.model = {
    backLink: routes.microchipSearch.get,
    dogId: dogDetails.dogId,
    breed: {
      id: 'breed',
      name: 'breed',
      fieldset: {
        legend: {
          text: 'Breed type'
        }
      },
      value: dogDetails[keys.breed],
      items: breedTypes.map(type => ({
        text: type.breed,
        value: type.breed
      }))
    },
    name: {
      id: 'name',
      name: 'name',
      classes: 'govuk-!-width-one-half',
      label: {
        text: 'Dog name (optional)'
      },
      value: dogDetails[keys.name],
      attributes: { maxlength: '32' }
    },
    ...applicationTypeElements(dogDetails),
    microchipNumber: dogDetails.microchipNumber,
    errors: []
  }

  errorPusherWithDate(errors, this.model)
}

module.exports = ViewModel
