const { routes: ownerRoutes } = require('../../../constants/owner')
const { routes, keys } = require('../../../constants/cdo/dog')
const { addDateErrors } = require('../../../lib/date-helpers')

function ViewModel (dogDetails, breedTypes, errors) {
  this.model = {
    formAction: routes.details.post,
    backLink: ownerRoutes.confirmation.get,
    dogId: dogDetails.id,
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
    cdoIssued: {
      type: 'date',
      id: 'cdoIssued',
      namePrefix: 'cdoIssued',
      fieldset: {
        legend: {
          text: 'CDO Issue Date',
          classes: 'govuk-!-font-weight-bold'
        }
      },
      items: [
        {
          name: 'day',
          classes: 'govuk-input--width-2',
          value: dogDetails[`${keys.cdoIssued}-day`],
          attributes: { maxlength: '2' }
        },
        {
          name: 'month',
          classes: 'govuk-input--width-2',
          value: dogDetails[`${keys.cdoIssued}-month`],
          attributes: { maxlength: '2' }
        },
        {
          name: 'year',
          classes: 'govuk-input--width-4',
          value: dogDetails[`${keys.cdoIssued}-year`],
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
