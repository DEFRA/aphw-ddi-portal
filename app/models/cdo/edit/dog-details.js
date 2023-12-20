const { routes: ownerRoutes } = require('../../../constants/owner')
const { routes, keys } = require('../../../constants/cdo/dog')
const { addDateErrors } = require('../../../lib/date-helpers')

function ViewModel (dogDetails, breedTypes, errors) {
  this.model = {
    formAction: routes.editDogDetails.post,
    backLink: ownerRoutes.home.get,
    dogId: dogDetails.id,
    indexNumber: dogDetails.indexNumber,
    name: {
      id: 'name',
      name: 'name',
      classes: 'govuk-!-width-one-half govuk-!-font-size-16',
      label: {
        text: 'Dog name',
        classes: 'govuk-!-font-weight-bold govuk-!-font-size-16'
      },
      value: dogDetails.name,
      attributes: { maxlength: '32' }
    },
    breed: {
      id: 'breed',
      name: 'breed',
      classes: 'govuk-!-font-size-16',
      label: {
        text: 'Breed type',
        classes: 'govuk-!-font-weight-bold govuk-!-font-size-16'
      },
      value: dogDetails.breed || dogDetails.dog_breed.breed,
      items: breedTypes.map(type => ({
        text: type.breed,
        value: type.breed
      }))
    },
    colour: {
      id: 'colour',
      name: 'colour',
      classes: 'govuk-!-width-one-half govuk-!-font-size-16',
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
      classes: 'govuk-!-font-size-16',
      label: {
        text: 'Sex',
        classes: 'govuk-!-font-weight-bold govuk-!-font-size-16'
      },
      value: dogDetails.sex,
      items: [
        { text: 'Choose sex' },
        { text: 'Male', value: 'Male' },
        { text: 'Female', value: 'Female' }
      ]
    },
    dateOfBirth: {
      type: 'date',
      id: 'dateOfBirth',
      namePrefix: 'dateOfBirth',
      classes: 'govuk-!-font-size-16',
      fieldset: {
        legend: {
          text: 'Date of birth',
          classes: 'govuk-!-font-weight-bold govuk-!-font-size-16'
        }
      },
      items: [
        {
          name: 'day',
          classes: 'govuk-input--width-2 govuk-!-font-size-16',
          value: dogDetails[`${keys.dateOfBirth}-day`],
          attributes: { maxlength: '2' }
        },
        {
          name: 'month',
          classes: 'govuk-input--width-2 govuk-!-font-size-16',
          value: dogDetails[`${keys.dateOfBirth}-month`],
          attributes: { maxlength: '2' }
        },
        {
          name: 'year',
          classes: 'govuk-input--width-4 govuk-!-font-size-16',
          value: dogDetails[`${keys.dateOfBirth}-year`],
          attributes: { maxlength: '4' }
        }
      ]
    },
    dateOfDeath: {
      type: 'date',
      id: 'dateOfDeath',
      namePrefix: 'dateOfDeath',
      fieldset: {
        legend: {
          text: 'Date of death',
          classes: 'govuk-!-font-weight-bold govuk-!-font-size-16'
        }
      },
      items: [
        {
          name: 'day',
          classes: 'govuk-input--width-2 govuk-!-font-size-16',
          value: dogDetails[`${keys.dateOfDeath}-day`],
          attributes: { maxlength: '2' }
        },
        {
          name: 'month',
          classes: 'govuk-input--width-2 govuk-!-font-size-16',
          value: dogDetails[`${keys.dateOfDeath}-month`],
          attributes: { maxlength: '2' }
        },
        {
          name: 'year',
          classes: 'govuk-input--width-4 govuk-!-font-size-16',
          value: dogDetails[`${keys.dateOfDeath}-year`],
          attributes: { maxlength: '4' }
        }
      ]
    },
    tattoo: {
      id: 'tattoo',
      name: 'tattoo',
      classes: 'govuk-!-width-one-half govuk-!-font-size-16',
      label: {
        text: 'Tattoo',
        classes: 'govuk-!-font-weight-bold govuk-!-font-size-16'
      },
      value: dogDetails.tattoo,
      attributes: { maxlength: '8' }
    },
    microchipNumber: {
      id: 'microchipNumber',
      name: 'microchipNumber',
      classes: 'govuk-!-width-one-half govuk-!-font-size-16',
      label: {
        text: 'Microchip number',
        classes: 'govuk-!-font-weight-bold govuk-!-font-size-16'
      },
      value: dogDetails.microchipNumber,
      attributes: { maxlength: '15' }
    },
    microchipNumber2: {
      id: 'microchipNumber2',
      name: 'microchipNumber2',
      classes: 'govuk-!-width-one-half govuk-!-font-size-16',
      label: {
        text: 'Microchip number 2',
        classes: 'govuk-!-font-weight-bold govuk-!-font-size-16'
      },
      value: dogDetails.microchipNumber2,
      attributes: { maxlength: '15' }
    },
    dateExported: {
      type: 'date',
      id: 'dateExported',
      namePrefix: 'dateExported',
      fieldset: {
        legend: {
          text: 'Date exported',
          classes: 'govuk-!-font-weight-bold govuk-!-font-size-16'
        }
      },
      items: [
        {
          name: 'day',
          classes: 'govuk-input--width-2 govuk-!-font-size-16',
          value: dogDetails[`${keys.dateExported}-day`],
          attributes: { maxlength: '2' }
        },
        {
          name: 'month',
          classes: 'govuk-input--width-2 govuk-!-font-size-16',
          value: dogDetails[`${keys.dateExported}-month`],
          attributes: { maxlength: '2' }
        },
        {
          name: 'year',
          classes: 'govuk-input--width-4 govuk-!-font-size-16',
          value: dogDetails[`${keys.dateExported}-year`],
          attributes: { maxlength: '4' }
        }
      ]
    },
    dateStolen: {
      type: 'date',
      id: 'dateStolen',
      namePrefix: 'dateStolen',
      fieldset: {
        legend: {
          text: 'Date stolen',
          classes: 'govuk-!-font-weight-bold govuk-!-font-size-16'
        }
      },
      items: [
        {
          name: 'day',
          classes: 'govuk-input--width-2 govuk-!-font-size-16',
          value: dogDetails[`${keys.dateStolen}-day`],
          attributes: { maxlength: '2' }
        },
        {
          name: 'month',
          classes: 'govuk-input--width-2 govuk-!-font-size-16',
          value: dogDetails[`${keys.dateStolen}-month`],
          attributes: { maxlength: '2' }
        },
        {
          name: 'year',
          classes: 'govuk-input--width-4 govuk-!-font-size-16',
          value: dogDetails[`${keys.dateStolen}-year`],
          attributes: { maxlength: '4' }
        }
      ]
    },
    errors: []
  }

  if (errors) {
    for (const error of errors.details) {
      let name = error.path[0]
      const prop = this.model[name]

      if (prop) {
        if (prop.type === 'date') {
          name = addDateErrors(error, prop)
        }

        prop.errorMessage = { text: error.message }
        this.model.errors.push({ text: error.message, href: `#${name}` })
      }
    }
  }
}

module.exports = ViewModel
