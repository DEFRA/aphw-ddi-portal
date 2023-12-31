const { routes } = require('../../../constants/cdo/dog')
const { forms } = require('../../../constants/forms')
const { addDateErrors } = require('../../../lib/date-helpers')

function ViewModel (exemption, courts, policeForces, companies, errors) {
  this.model = {
    backLink: `${routes.viewDogDetails.get}/${exemption.indexNumber}`,
    formAction: routes.editExemptionDetails.post,
    exemption: {
      indexNumber: exemption.indexNumber,
      status: {
        label: {
          text: 'Status',
          classes: 'govuk-!-font-weight-bold govuk-!-font-size-16'
        },
        id: 'status',
        name: 'status',
        value: exemption.status,
        items: [
          {
            value: 'Imported Dog',
            text: 'Imported Dog'
          }
        ],
        autocomplete: forms.preventAutocomplete,
        classes: 'govuk-!-font-size-16'
      },
      certificateIssued: {
        type: 'date',
        id: 'certificateIssued',
        namePrefix: 'certificateIssued',
        fieldset: {
          legend: {
            text: 'Certificate issued',
            classes: 'govuk-!-font-weight-bold govuk-!-font-size-16'
          }
        },
        items: [
          {
            name: 'day',
            classes: 'govuk-input--width-2 govuk-!-font-size-16',
            value: exemption['certificateIssued-day'],
            attributes: { maxlength: '2' }
          },
          {
            name: 'month',
            classes: 'govuk-input--width-2 govuk-!-font-size-16',
            value: exemption['certificateIssued-month'],
            attributes: { maxlength: '2' }
          },
          {
            name: 'year',
            classes: 'govuk-input--width-4 govuk-!-font-size-16',
            value: exemption['certificateIssued-year'],
            attributes: { maxlength: '4' }
          }
        ]
      },
      cdoIssued: {
        type: 'date',
        id: 'cdoIssued',
        namePrefix: 'cdoIssued',
        fieldset: {
          legend: {
            text: 'CDO issued',
            classes: 'govuk-!-font-weight-bold govuk-!-font-size-16'
          }
        },
        items: [
          {
            name: 'day',
            classes: 'govuk-input--width-2',
            value: exemption['cdoIssued-day'],
            attributes: { maxlength: '2' }
          },
          {
            name: 'month',
            classes: 'govuk-input--width-2',
            value: exemption['cdoIssued-month'],
            attributes: { maxlength: '2' }
          },
          {
            name: 'year',
            classes: 'govuk-input--width-4',
            value: exemption['cdoIssued-year'],
            attributes: { maxlength: '4' }
          }
        ],
        classes: 'govuk-!-font-size-16'
      },
      cdoExpiry: {
        type: 'date',
        id: 'cdoExpiry',
        namePrefix: 'cdoExpiry',
        fieldset: {
          legend: {
            text: 'CDO expiry',
            classes: 'govuk-!-font-weight-bold govuk-!-font-size-16'
          }
        },
        items: [
          {
            name: 'day',
            classes: 'govuk-input--width-2 govuk-!-font-size-16',
            value: exemption['cdoExpiry-day'],
            attributes: { maxlength: '2' }
          },
          {
            name: 'month',
            classes: 'govuk-input--width-2 govuk-!-font-size-16',
            value: exemption['cdoExpiry-month'],
            attributes: { maxlength: '2' }
          },
          {
            name: 'year',
            classes: 'govuk-input--width-4 govuk-!-font-size-16',
            value: exemption['cdoExpiry-year'],
            attributes: { maxlength: '4' }
          }
        ]
      },
      court: {
        label: {
          text: 'Court',
          classes: 'govuk-!-font-weight-bold govuk-!-font-size-16'
        },
        id: 'court',
        name: 'court',
        value: exemption.court,
        placeholder: 'Start typing to choose court',
        items: [{ text: 'Select a court', value: '' }].concat(courts.map(court => ({
          value: court.name,
          text: court.name
        }))),
        autocomplete: forms.preventAutocomplete,
        classes: 'govuk-!-font-size-16'
      },
      policeForce: {
        label: {
          text: 'Police force',
          classes: 'govuk-!-font-weight-bold govuk-!-font-size-16'
        },
        id: 'policeForce',
        name: 'policeForce',
        value: exemption.policeForce,
        items: [{ text: 'Select a police force', value: '' }].concat(policeForces.map(force => ({
          value: force.name,
          text: force.name
        }))),
        autocomplete: forms.preventAutocomplete,
        classes: 'govuk-!-font-size-16'
      },
      legislationOfficer: {
        label: {
          text: 'Dog legislation officer',
          classes: 'govuk-!-font-weight-bold govuk-!-font-size-16'
        },
        id: 'legislationOfficer',
        name: 'legislationOfficer',
        classes: 'govuk-input--width-20 govuk-!-font-size-16',
        value: exemption.legislationOfficer,
        autocomplete: forms.preventAutocomplete,
        attributes: { maxlength: '64' }
      },
      applicationFeePaid: {
        type: 'date',
        id: 'applicationFeePaid',
        namePrefix: 'applicationFeePaid',
        fieldset: {
          legend: {
            text: 'Application fee paid',
            classes: 'govuk-!-font-weight-bold govuk-!-font-size-16'
          }
        },
        items: [
          {
            name: 'day',
            classes: 'govuk-input--width-2 govuk-!-font-size-16',
            value: exemption['applicationFeePaid-day'],
            attributes: { maxlength: '2' }
          },
          {
            name: 'month',
            classes: 'govuk-input--width-2 govuk-!-font-size-16',
            value: exemption['applicationFeePaid-month'],
            attributes: { maxlength: '2' }
          },
          {
            name: 'year',
            classes: 'govuk-input--width-4 govuk-!-font-size-16',
            value: exemption['applicationFeePaid-year'],
            attributes: { maxlength: '4' }
          }
        ]
      },
      insuranceCompany: {
        label: {
          text: 'Insurance company',
          classes: 'govuk-!-font-weight-bold govuk-!-font-size-16'
        },
        id: 'insuranceCompany',
        name: 'insuranceCompany',
        value: exemption.insuranceCompany,
        items: [{ text: '' }].concat(companies.map(company => ({
          value: company.name,
          text: company.name
        }))),
        autocomplete: forms.preventAutocomplete,
        classes: 'govuk-!-font-size-16'
      },
      insuranceRenewal: {
        type: 'date',
        id: 'insuranceRenewal',
        namePrefix: 'insuranceRenewal',
        fieldset: {
          legend: {
            text: 'Insurance renewal date',
            classes: 'govuk-!-font-weight-bold govuk-!-font-size-16'
          }
        },
        items: [
          {
            name: 'day',
            classes: 'govuk-input--width-2 govuk-!-font-size-16',
            value: exemption['insuranceRenewal-day'],
            attributes: { maxlength: '2' }
          },
          {
            name: 'month',
            classes: 'govuk-input--width-2 govuk-!-font-size-16',
            value: exemption['insuranceRenewal-month'],
            attributes: { maxlength: '2' }
          },
          {
            name: 'year',
            classes: 'govuk-input--width-4 govuk-!-font-size-16',
            value: exemption['insuranceRenewal-year'],
            attributes: { maxlength: '4' }
          }
        ]
      },
      neuteringConfirmation: {
        type: 'date',
        id: 'neuteringConfirmation',
        namePrefix: 'neuteringConfirmation',
        fieldset: {
          legend: {
            text: 'Neutering confirmed',
            classes: 'govuk-!-font-weight-bold govuk-!-font-size-16'
          }
        },
        items: [
          {
            name: 'day',
            classes: 'govuk-input--width-2 govuk-!-font-size-16',
            value: exemption['neuteringConfirmation-day'],
            attributes: { maxlength: '2' }
          },
          {
            name: 'month',
            classes: 'govuk-input--width-2 govuk-!-font-size-16',
            value: exemption['neuteringConfirmation-month'],
            attributes: { maxlength: '2' }
          },
          {
            name: 'year',
            classes: 'govuk-input--width-4 govuk-!-font-size-16',
            value: exemption['neuteringConfirmation-year'],
            attributes: { maxlength: '4' }
          }
        ]
      },
      microchipVerification: {
        type: 'date',
        id: 'microchipVerification',
        namePrefix: 'microchipVerification',
        fieldset: {
          legend: {
            text: 'Microchip number verified',
            classes: 'govuk-!-font-weight-bold govuk-!-font-size-16'
          }
        },
        items: [
          {
            name: 'day',
            classes: 'govuk-input--width-2 govuk-!-font-size-16',
            value: exemption['microchipVerification-day'],
            attributes: { maxlength: '2' }
          },
          {
            name: 'month',
            classes: 'govuk-input--width-2 govuk-!-font-size-16',
            value: exemption['microchipVerification-month'],
            attributes: { maxlength: '2' }
          },
          {
            name: 'year',
            classes: 'govuk-input--width-4 govuk-!-font-size-16',
            value: exemption['microchipVerification-year'],
            attributes: { maxlength: '4' }
          }
        ]
      },
      joinedExemptionScheme: {
        type: 'date',
        id: 'joinedExemptionScheme',
        namePrefix: 'joinedExemptionScheme',
        fieldset: {
          legend: {
            text: 'Joined interim exemption scheme',
            classes: 'govuk-!-font-weight-bold govuk-!-font-size-16'
          }
        },
        items: [
          {
            name: 'day',
            classes: 'govuk-input--width-2 govuk-!-font-size-16',
            value: exemption['joinedExemptionScheme-day'],
            attributes: { maxlength: '2' }
          },
          {
            name: 'month',
            classes: 'govuk-input--width-2 govuk-!-font-size-16',
            value: exemption['joinedExemptionScheme-month'],
            attributes: { maxlength: '2' }
          },
          {
            name: 'year',
            classes: 'govuk-input--width-4 govuk-!-font-size-16',
            value: exemption['joinedExemptionScheme-year'],
            attributes: { maxlength: '4' }
          }
        ]
      }
    },
    errors: []
  }

  if (errors) {
    for (const error of errors.details) {
      let name = error.path[0] ?? error.context.path[0]
      const prop = this.model.exemption[name]

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
