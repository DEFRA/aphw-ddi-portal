const { routes: ownerRoutes } = require('../../../constants/cdo/owner')
const { routes } = require('../../../constants/cdo/dog')

function ViewModel (details, errors) {
  this.model = {
    formAction: routes.details.post,
    backLink: ownerRoutes.ownerDetails.get,
    dogId: details.id,
    microchipNumber: {
      id: 'microchipNumber',
      name: 'microchipNumber',
      classes: 'govuk-!-width-one-half',
      value: details.microchipNumber,
      attributes: { maxlength: '20' }
    },
    errors: []
  }

  if (errors) {
    for (const error of errors.details) {
      const name = error.path[0]
      const prop = this.model[name]

      if (prop) {
        prop.errorMessage = { text: error.message }
        this.model.errors.push({ text: error.message, href: `#${name}` })
      }
    }
  }
}

module.exports = ViewModel
