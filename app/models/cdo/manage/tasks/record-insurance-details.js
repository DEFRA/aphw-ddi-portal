const { forms } = require('../../../../constants/forms')
const { errorPusherWithDate } = require('../../../../lib/error-helpers')
const { constructDateField } = require('../../../../lib/model-helpers')

function ViewModel (data, backNav, errors) {
  this.model = {
    backLink: backNav.backLink === '/' ? `/cdo/manage/cdo/${data.indexNumber}` : backNav.backLink,
    srcHashParam: backNav.srcHashParam,
    indexNumber: data.indexNumber,
    taskName: data.taskName,
    insuranceCompany: {
      label: {
        text: 'What company insures the dog?'
      },
      id: 'insuranceCompany',
      name: 'insuranceCompany',
      value: data.insuranceCompany,
      items: [{ text: '' }].concat(data.companies.map(company => ({
        value: company.name,
        text: company.name
      }))),
      autocomplete: forms.preventAutocomplete,
      classes: 'govuk-!-width-two-thirds govuk-!-margin-bottom-5'
    },
    insuranceRenewal: constructDateField(data, 'insuranceRenewal', 'What is the insurance renewal date?', null, ''),
    errors: []
  }

  errorPusherWithDate(errors, this.model)
}

module.exports = ViewModel
