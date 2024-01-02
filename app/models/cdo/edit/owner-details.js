const { routes } = require('../../../constants/owner')
const { forms } = require('../../../constants/forms')
const { addDateErrors } = require('../../../lib/date-helpers')

function ViewModel (person, countries, errors) {
  this.model = {
    backLink: `${routes.viewOwnerDetails.get}/${person.personReference}`,
    formAction: routes.editDetails.post,
    person: {
      personReference: person.personReference,
      firstName: {
        label: {
          text: 'First name',
          classes: 'govuk-!-font-weight-bold govuk-!-font-size-16'
        },
        id: 'firstName',
        name: 'firstName',
        classes: 'govuk-input--width-20 govuk-!-font-size-16',
        value: person.firstName,
        autocomplete: forms.preventAutocomplete,
        attributes: { maxlength: '30' }
      },
      lastName: {
        label: {
          text: 'Last name',
          classes: 'govuk-!-font-weight-bold govuk-!-font-size-16'
        },
        id: 'lastName',
        name: 'lastName',
        classes: 'govuk-input--width-20 govuk-!-font-size-16',
        value: person.lastName,
        autocomplete: forms.preventAutocomplete,
        attributes: { maxlength: '24' }
      },
      dateOfBirth: {
        type: 'date',
        id: 'dateOfBirth',
        namePrefix: 'dateOfBirth',
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
            value: person['dateOfBirth-day'],
            attributes: { maxlength: '2' }
          },
          {
            name: 'month',
            classes: 'govuk-input--width-2 govuk-!-font-size-16',
            value: person['dateOfBirth-month'],
            attributes: { maxlength: '2' }
          },
          {
            name: 'year',
            classes: 'govuk-input--width-4 govuk-!-font-size-16',
            value: person['dateOfBirth-year'],
            attributes: { maxlength: '4' }
          }
        ]
      },
      addressLine1: {
        id: 'addressLine1',
        name: 'addressLine1',
        label: {
          text: 'Address line 1',
          classes: 'govuk-!-font-weight-bold govuk-!-font-size-16'
        },
        classes: 'govuk-!-font-size-16',
        value: person.addressLine1 ?? person.address?.addressLine1,
        autocomplete: forms.preventAutocomplete,
        attributes: { maxlength: '50' }
      },
      addressLine2: {
        id: 'addressLine2',
        name: 'addressLine2',
        label: {
          text: 'Address line 2 (optional)',
          classes: 'govuk-!-font-weight-bold govuk-!-font-size-16'
        },
        value: person.addressLine2 ?? person.address?.addressLine2,
        classes: 'govuk-!-font-size-16',
        autocomplete: forms.preventAutocomplete,
        attributes: { maxlength: '50' }
      },
      town: {
        id: 'town',
        name: 'town',
        label: {
          text: 'Town or city',
          classes: 'govuk-!-font-weight-bold govuk-!-font-size-16'
        },
        value: person.town ?? person.address?.town,
        autocomplete: forms.preventAutocomplete,
        classes: 'govuk-!-width-two-thirds govuk-!-font-size-16',
        attributes: { maxlength: '50' }
      },
      postcode: {
        id: 'postcode',
        name: 'postcode',
        label: {
          text: 'Postcode',
          classes: 'govuk-!-font-weight-bold govuk-!-font-size-16'
        },
        value: person.postcode ?? person.address?.postcode,
        classes: 'govuk-input--width-10 govuk-!-font-size-16',
        autocomplete: forms.preventAutocomplete,
        attributes: { maxlength: '8' }
      },
      email: {
        label: {
          text: 'Email address',
          classes: 'govuk-!-font-weight-bold govuk-!-font-size-16'
        },
        id: 'email',
        name: 'email',
        classes: 'govuk-!-font-size-16',
        value: person.email ?? person.contacts?.emails[0],
        autocomplete: forms.preventAutocomplete,
        attributes: { maxlength: '255' }
      },
      primaryTelephone: {
        label: {
          text: 'Telephone number 1',
          classes: 'govuk-!-font-weight-bold govuk-!-font-size-16'
        },
        id: 'primaryTelephone',
        name: 'primaryTelephone',
        classes: 'govuk-input--width-10 govuk-!-font-size-16',
        value: person.primaryTelephone ?? person.contacts?.primaryTelephones[0],
        autocomplete: forms.preventAutocomplete,
        attributes: { maxlength: '13' }
      },
      secondaryTelephone: {
        label: {
          text: 'Telephone number 2',
          classes: 'govuk-!-font-weight-bold govuk-!-font-size-16'
        },
        id: 'secondaryTelephone',
        name: 'secondaryTelephone',
        classes: 'govuk-input--width-10 govuk-!-font-size-16',
        value: person.secondaryTelephone ?? person.contacts?.secondaryTelephones[0],
        autocomplete: forms.preventAutocomplete,
        attributes: { maxlength: '13' }
      },
      country: {
        label: {
          text: 'Country',
          classes: 'govuk-!-font-weight-bold govuk-!-font-size-16'
        },
        id: 'country',
        name: 'country',
        value: person.country ?? person.address?.country,
        items: countries.map(country => ({
          value: country,
          text: country
        })),
        classes: 'govuk-!-font-size-16'
      }
    },
    errors: []
  }

  if (errors) {
    for (const error of errors.details) {
      let name = error.path[0]
      const prop = this.model.person[name]

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
