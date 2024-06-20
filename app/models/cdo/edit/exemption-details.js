const { forms } = require('../../../constants/forms')
const { errorPusherWithDate } = require('../../../lib/error-helpers')
const { constructDateField } = require('../../../lib/model-helpers')

function ViewModel (exemption, courts, policeForces, companies, backNav, errors) {
  this.model = {
    backLink: backNav.backLink,
    srcHashParam: backNav.srcHashParam,
    indexNumber: exemption.indexNumber,
    exemptionOrder: {
      label: {
        text: 'Order',
        classes: 'govuk-!-font-weight-bold govuk-!-font-size-16'
      },
      name: 'exemptionOrder',
      id: 'exemptionOrder',
      value: exemption.exemptionOrder,
      items: [
        {
          value: '2015',
          text: '2015'
        },
        {
          value: '2023',
          text: '2023'
        }
      ]
    },
    status: exemption.status,
    certificateIssued: constructDateField(exemption, 'certificateIssued', 'First certificate issued'),
    cdoIssued: constructDateField(exemption, 'cdoIssued', 'CDO issued'),
    cdoExpiry: constructDateField(exemption, 'cdoExpiry', 'CDO expiry'),
    court: {
      label: {
        text: 'Court',
        classes: 'govuk-!-font-weight-bold'
      },
      id: 'court',
      name: 'court',
      value: exemption.court,
      placeholder: 'Start typing to choose court',
      items: [{ text: 'Select a court', value: '' }].concat(courts.map(court => ({
        value: court.name,
        text: court.name
      }))),
      autocomplete: forms.preventAutocomplete
    },
    policeForce: {
      label: {
        text: 'Police force',
        classes: 'govuk-!-font-weight-bold'
      },
      id: 'policeForce',
      name: 'policeForce',
      value: exemption.policeForce,
      items: [{ text: 'Select a police force', value: '' }].concat(policeForces.map(force => ({
        value: force.name,
        text: force.name
      }))),
      autocomplete: forms.preventAutocomplete,
      classes: 'govuk-!-width-two-thirds govuk-!-margin-bottom-5'
    },
    legislationOfficer: {
      label: {
        text: 'Dog legislation officer',
        classes: 'govuk-!-font-weight-bold'
      },
      id: 'legislationOfficer',
      name: 'legislationOfficer',
      classes: 'govuk-!-width-two-thirds govuk-!-margin-bottom-5',
      value: exemption.legislationOfficer,
      autocomplete: forms.preventAutocomplete,
      attributes: { maxlength: '64' }
    },
    applicationFeePaid: constructDateField(exemption, 'applicationFeePaid', 'Application fee paid'),
    insuranceCompany: {
      label: {
        text: 'Insurance company',
        classes: 'govuk-!-font-weight-bold'
      },
      id: 'insuranceCompany',
      name: 'insuranceCompany',
      value: exemption.insuranceCompany,
      items: [{ text: '' }].concat(companies.map(company => ({
        value: company.name,
        text: company.name
      }))),
      autocomplete: forms.preventAutocomplete,
      classes: 'govuk-!-width-two-thirds govuk-!-margin-bottom-5'
    },
    insuranceRenewal: constructDateField(exemption, 'insuranceRenewal', 'Insurance renewal date'),
    neuteringConfirmation: constructDateField(exemption, 'neuteringConfirmation', 'Neutering confirmed'),
    microchipVerification: constructDateField(exemption, 'microchipVerification', 'Microchip number verified'),
    joinedExemptionScheme: constructDateField(exemption, 'joinedExemptionScheme', 'Joined interim exemption scheme'),
    nonComplianceLetterSent: constructDateField(exemption, 'nonComplianceLetterSent', 'Non-compliance letter sent'),
    microchipDeadline: constructDateField(exemption, 'microchipDeadline', 'Microchip deadline', 'The dog must be microchipped by this date.'),
    typedByDlo: constructDateField(exemption, 'typedByDlo', 'Examined by DLO'),
    withdrawn: constructDateField(exemption, 'withdrawn', 'Withdrawn from index', 'An owner can ask for their dog be withdrawn from the index. DLOs can ask for a dog to be withdrawn if they do not consider it to be an XL Bully.'),
    errors: []
  }

  errorPusherWithDate(errors, this.model)
}

module.exports = ViewModel
