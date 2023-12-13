const { routes: ownerRoutes } = require('../../../constants/owner')
const { routes, keys } = require('../../../constants/cdo/dog')

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
      value: dogDetails[keys.name]
    },
    cdoIssued: {
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
          value: dogDetails[`${keys.cdoIssued}-day`]
        },
        {
          name: 'month',
          classes: 'govuk-input--width-2',
          value: dogDetails[`${keys.cdoIssued}-month`]
        },
        {
          name: 'year',
          classes: 'govuk-input--width-4',
          value: dogDetails[`${keys.cdoIssued}-year`]
        }
      ]
    },
    errors: []
  }

  if (errors) {
    for (const error of errors.details) {
      const name = error.path[0]
      const prop = this.model[name]

      if (prop !== undefined) {
        if (name === 'cdoIssued') {
          const itemName = error.path[1] || error.context.path?.[1] || undefined

          if (itemName) {
            const item = prop.items.find(item => item.name === itemName)

            item.classes += ' govuk-input--error'
          } else {
            for (const item of prop.items) {
              item.classes += ' govuk-input--error'
            }
          }
        }

        prop.errorMessage = {
          text: error.message
        }

        this.model.errors.push({
          text: error.message,
          href: `#${name}`
        })
      }
    }
  }
}

module.exports = ViewModel
