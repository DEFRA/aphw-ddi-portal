const { routes } = require('../../../constants/owner')
const { forms } = require('../../../constants/forms')

function ViewModel (person) {
  this.model = {
    backLink: '/',
    person: {
      firstName: {
        label: {
          text: 'First name'
        },
        id: 'firstName',
        name: 'firstName',
        classes: 'govuk-input--width-20',
        value: person.firstName,
        autocomplete: forms.preventAutocomplete,
        attributes: { maxlength: '30' }
      },
      lastName: {
        label: {
          text: 'Last name'
        },
        id: 'lastName',
        name: 'lastName',
        classes: 'govuk-input--width-20',
        value: person.lastName,
        autocomplete: forms.preventAutocomplete,
        attributes: { maxlength: '24' }
      },
      dateOfBirth: {
        id: 'owner-date-of-birth',
        fieldset: {
          legend: {
            isPageHeading: false,
            classes: 'govuk-input--width-20'
          }
        },
        items: [
          {
            name: 'dob-day',
            classes: 'govuk-input--width-2',
            value: person['dob-day'],
            label: 'Day',
            autocomplete: forms.preventAutocomplete,
            attributes: { maxlength: '2' }
          },
          {
            name: 'dob-month',
            classes: 'govuk-input--width-2',
            value: person['dob-month'],
            label: 'Month',
            autocomplete: forms.preventAutocomplete,
            attributes: { maxlength: '2' }
          },
          {
            name: 'dob-year',
            classes: 'govuk-input--width-4',
            value: person['dob-year'],
            label: 'Year',
            autocomplete: forms.preventAutocomplete,
            attributes: { maxlength: '4' }
          }
        ]
      },
      addressLine1: {
        id: 'addressLine1',
        name: 'addressLine1',
        label: {
          text: 'Address line 1'
        },
        value: person.address.addressLine1,
        autocomplete: forms.preventAutocomplete,
        attributes: { maxlength: '50' }
      },
      addressLine2: {
        id: 'addressLine2',
        name: 'addressLine2',
        label: {
          text: 'Address line 2 (optional)'
        },
        value: person.address.addressLine2,
        autocomplete: forms.preventAutocomplete,
        attributes: { maxlength: '50' }
      },
      town: {
        id: 'town',
        name: 'town',
        label: {
          text: 'Town or city'
        },
        value: person.address.town,
        autocomplete: forms.preventAutocomplete,
        attributes: { maxlength: '50' }
      },
      postcode: {
        id: 'postcode',
        name: 'postcode',
        label: {
          text: 'Postcode'
        },
        value: person.address.postcode,
        classes: 'govuk-input--width-10',
        autocomplete: forms.preventAutocomplete,
        attributes: { maxlength: '8' }
      },
      country: {
        id: 'country',
        name: 'country',
        label: {
          text: 'Country'
        },
        value: person.address.country,
        autocomplete: forms.preventAutocomplete,
        attributes: { maxlength: '30' }
      },
      postcode: {
        label: {
          text: 'Postcode'
        },
        id: 'postcode',
        name: 'postcode',
        classes: 'govuk-input--width-10',
        value: person.address.postcode,
        autocomplete: forms.preventAutocomplete,
        attributes: { maxlength: '8' }
      },
      email: {
        label: {
          text: 'Email'
        },
        id: 'email',
        name: 'email',
        classes: 'govuk-input--width-10',
        value: person.contacts.email,
        autocomplete: forms.preventAutocomplete,
        attributes: { maxlength: '8' }
      },
      email: {
        label: {
          text: 'Email'
        },
        id: 'email',
        name: 'email',
        classes: 'govuk-input--width-10',
        value: person.contacts.email,
        autocomplete: forms.preventAutocomplete,
        attributes: { maxlength: '8' }
      },
      email: {
        label: {
          text: 'Email'
        },
        id: 'email',
        name: 'email',
        classes: 'govuk-input--width-10',
        value: person.contacts.email,
        autocomplete: forms.preventAutocomplete,
        attributes: { maxlength: '8' }
      },
      primaryTelephone: {
        label: {
          text: 'Telephone number 1'
        },
        id: 'primaryTelephone',
        name: 'primaryTelephone',
        classes: 'govuk-input--width-10',
        value: person.contacts.primaryTelephone,
        autocomplete: forms.preventAutocomplete,
        attributes: { maxlength: '8' }
      },
      secondaryTelephone: {
        label: {
          text: 'Telephone number 2'
        },
        id: 'secondaryTelephone',
        name: 'secondaryTelephone',
        classes: 'govuk-input--width-10',
        value: person.contacts.secondaryTelephone,
        autocomplete: forms.preventAutocomplete,
        attributes: { maxlength: '8' }
      },
      country: {
        label: {
          text: 'Telephone number 2'
        },
        id: 'secondaryTelephone',
        name: 'secondaryTelephone',
        classes: 'govuk-input--width-10',
        value: person.address.country,
        autocomplete: forms.preventAutocomplete,
        attributes: { maxlength: '8' }
      }
    }
  }
}

module.exports = ViewModel
