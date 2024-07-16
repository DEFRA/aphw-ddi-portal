const { keys } = require('../../../constants/cdo/dog')
const { errorPusherWithDate } = require('../../../lib/error-helpers')
const { constructDateField } = require('../../../lib/model-helpers')

function ViewModel (dogDetails, breedTypes, country, backNav, errors) {
  this.model = {
    backLink: backNav.backLink,
    srcHashParam: backNav.srcHashParam,
    id: dogDetails.id,
    indexNumber: dogDetails.indexNumber,
    name: {
      id: 'name',
      name: 'name',
      classes: 'govuk-!-width-one-half govuk-!-margin-bottom-5',
      label: {
        text: 'Dog name',
        classes: 'govuk-!-font-weight-bold'
      },
      value: dogDetails.name,
      attributes: { maxlength: '32' }
    },
    breed: {
      id: 'breed',
      name: 'breed',
      label: {
        text: 'Breed type',
        classes: 'govuk-!-font-weight-bold'
      },
      value: dogDetails.breed || dogDetails.dog_breed?.breed,
      items: breedTypes.map(type => ({
        text: type.breed,
        value: type.breed
      })),
      classes: 'govuk-!-margin-bottom-5'
    },
    colour: {
      id: 'colour',
      name: 'colour',
      classes: 'govuk-!-width-one-half govuk-!-margin-bottom-5',
      label: {
        text: 'Colour',
        classes: 'govuk-!-font-weight-bold'
      },
      value: dogDetails.colour,
      attributes: { maxlength: '50' }
    },
    sex: {
      id: 'sex',
      name: 'sex',
      label: {
        text: 'Sex',
        classes: 'govuk-!-font-weight-bold'
      },
      value: dogDetails.sex,
      items: [
        { text: 'Choose sex', value: null },
        { text: 'Male', value: 'Male' },
        { text: 'Female', value: 'Female' }
      ],
      classes: 'govuk-!-margin-bottom-5'
    },
    dateOfBirth: constructDateField(dogDetails, keys.dateOfBirth, 'Date of birth'),
    dateOfDeath: constructDateField(dogDetails, keys.dateOfDeath, 'Date of death'),
    tattoo: {
      id: 'tattoo',
      name: 'tattoo',
      classes: 'govuk-!-width-one-half govuk-!-margin-bottom-5',
      label: {
        text: 'Tattoo',
        classes: 'govuk-!-font-weight-bold'
      },
      value: dogDetails.tattoo,
      attributes: { maxlength: '8' }
    },
    microchipNumber: {
      id: 'microchipNumber',
      name: 'microchipNumber',
      classes: 'govuk-!-width-one-half govuk-!-margin-bottom-5',
      label: {
        text: 'Microchip number',
        classes: 'govuk-!-font-weight-bold'
      },
      value: dogDetails.microchipNumber,
      attributes: { maxlength: '20' }
    },
    microchipNumber2: {
      id: 'microchipNumber2',
      name: 'microchipNumber2',
      classes: 'govuk-!-width-one-half govuk-!-margin-bottom-5',
      label: {
        text: 'Microchip number 2',
        classes: 'govuk-!-font-weight-bold'
      },
      value: dogDetails.microchipNumber2,
      attributes: { maxlength: '20' }
    },
    origMicrochipNumber: dogDetails.origMicrochipNumber ?? dogDetails.microchipNumber,
    origMicrochipNumber2: dogDetails.origMicrochipNumber2 ?? dogDetails.microchipNumber2,
    dateExported: constructDateField(dogDetails, keys.dateExported, 'Date exported'),
    dateStolen: constructDateField(dogDetails, keys.dateStolen, 'Date stolen'),
    dateUntraceable: constructDateField(dogDetails, keys.dateUntraceable, 'Date untraceable'),
    country: country ?? dogDetails.country,
    errors: []
  }

  errorPusherWithDate(errors, this.model)
}

module.exports = ViewModel
