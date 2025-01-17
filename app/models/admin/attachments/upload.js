const { errorPusherDefault } = require('../../../lib/error-helpers')

function ViewModel (details, errors) {
  this.model = {
    id: 'attachmentUpload',
    name: 'upload',
    label: {
      text: 'Choose file',
      classes: 'govuk-visually-hidden'
    },
    templateType: {
      id: 'templateType',
      name: 'templateType',
      classes: 'defra-responsive-!-font-size-16',
      fieldset: {
        legend: {
          classes: 'govuk-fieldset__legend--m',
          isPageHeading: false,
          text: 'What type of template are you uploading?'
        }
      },
      items: [
        {
          text: 'Send application pack by email',
          value: 'email-application-pack'
        },
        {
          text: 'Post application pack as a letter',
          value: 'post-application-pack'
        }
      ],
      value: details?.templateType
    },
    errors: []
  }

  if (errors) {
    this.model.errorMessage = {
      text: errors.details[0].message
    }
    this.model.errors.push({ text: errors.details[0].message, href: '#attachmentUpload' })
  }

  errorPusherDefault(errors, this.model)
}

module.exports = ViewModel
