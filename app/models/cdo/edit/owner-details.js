const { forms } = require('../../../constants/forms')
const { errorPusherWithDate } = require('../../../lib/error-helpers')
const { constructDateField } = require('../../../lib/model-helpers')

function ViewModel (person, countries, backNav, errors) {
  this.model = {
    backLink: backNav.backLink,
    srcHashParam: backNav.srcHashParam,
    personReference: person.personReference,
    firstName: {
      label: {
        text: 'First name',
        classes: 'govuk-!-font-weight-bold'
      },
      id: 'firstName',
      name: 'firstName',
      classes: 'govuk-input--width-20 govuk-!-margin-bottom-5',
      value: person.firstName,
      autocomplete: forms.preventAutocomplete,
      attributes: { maxlength: '30' }
    },
    lastName: {
      label: {
        text: 'Last name',
        classes: 'govuk-!-font-weight-bold'
      },
      id: 'lastName',
      name: 'lastName',
      classes: 'govuk-input--width-20 govuk-!-margin-bottom-5',
      value: person.lastName,
      autocomplete: forms.preventAutocomplete,
      attributes: { maxlength: '24' }
    },
    dateOfBirth: constructDateField(person, 'dateOfBirth', 'Date of birth'),
    organisationName: person.organisationName,
    addressLine1: {
      id: 'addressLine1',
      name: 'addressLine1',
      label: {
        text: 'Address line 1',
        classes: 'govuk-!-font-weight-bold'
      },
      classes: 'govuk-!-margin-bottom-5',
      value: person.addressLine1 ?? person.address?.addressLine1,
      autocomplete: forms.preventAutocomplete,
      attributes: { maxlength: '50' }
    },
    addressLine2: {
      id: 'addressLine2',
      name: 'addressLine2',
      label: {
        text: 'Address line 2 (optional)',
        classes: 'govuk-!-font-weight-bold'
      },
      value: person.addressLine2 ?? person.address?.addressLine2,
      classes: 'govuk-!-margin-bottom-5',
      autocomplete: forms.preventAutocomplete,
      attributes: { maxlength: '50' }
    },
    town: {
      id: 'town',
      name: 'town',
      label: {
        text: 'Town or city',
        classes: 'govuk-!-font-weight-bold'
      },
      value: person.town ?? person.address?.town,
      autocomplete: forms.preventAutocomplete,
      classes: 'govuk-!-width-two-thirds govuk-!-margin-bottom-5',
      attributes: { maxlength: '50' }
    },
    postcode: {
      id: 'postcode',
      name: 'postcode',
      label: {
        text: 'Postcode',
        classes: 'govuk-!-font-weight-bold'
      },
      value: person.postcode ?? person.address?.postcode,
      classes: 'govuk-input--width-10 govuk-!-margin-bottom-5',
      autocomplete: forms.preventAutocomplete,
      attributes: { maxlength: '8' }
    },
    email: {
      label: {
        text: 'Email address',
        classes: 'govuk-!-font-weight-bold'
      },
      id: 'email',
      name: 'email',
      classes: 'govuk-!-margin-bottom-5',
      value: person.email ?? person.contacts?.emails[0],
      autocomplete: forms.preventAutocomplete,
      attributes: { maxlength: '254' }
    },
    primaryTelephone: {
      label: {
        text: 'Telephone number 1',
        classes: 'govuk-!-font-weight-bold'
      },
      id: 'primaryTelephone',
      name: 'primaryTelephone',
      classes: 'govuk-input--width-10 govuk-!-margin-bottom-5',
      value: person.primaryTelephone ?? person.contacts?.primaryTelephones[0],
      autocomplete: forms.preventAutocomplete,
      attributes: { maxlength: '13' }
    },
    secondaryTelephone: {
      label: {
        text: 'Telephone number 2',
        classes: 'govuk-!-font-weight-bold'
      },
      id: 'secondaryTelephone',
      name: 'secondaryTelephone',
      classes: 'govuk-input--width-10 govuk-!-margin-bottom-5',
      value: person.secondaryTelephone ?? person.contacts?.secondaryTelephones[0],
      autocomplete: forms.preventAutocomplete,
      attributes: { maxlength: '13' }
    },
    country: {
      label: {
        text: 'Country',
        classes: 'govuk-!-font-weight-bold'
      },
      id: 'country',
      name: 'country',
      value: person.country ?? person.address?.country,
      items: countries.map(country => ({
        value: country,
        text: country
      })),
      classes: 'govuk-!-margin-bottom-5'
    },
    errors: []
  }

  errorPusherWithDate(errors, this.model)
}

module.exports = ViewModel
