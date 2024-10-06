const { forms } = require('../../../../constants/forms')
const summaryList = (users, remove = false) => {
  const removeItems = (user, _idx) => {
    return !remove
      ? []
      : [{
          text: 'Remove',
          visuallyHiddenText: `remove ${user}`
        }]
  }
  return {
    rows: users.map((user, idx) => {
      return {
        key: {
          text: user,
          classes: 'govuk-!-width-two-thirds govuk-!-font-weight-regular'
        },
        value: '',
        actions: {
          classes: 'govuk-!-width-one-third govuk-visually-hidden',
          items: [
            {
              text: 'Change',
              visuallyHiddenText: `Change ${user}`,
              classes: 'govuk-!-hidden'
            },
            ...removeItems(user, idx)
          ]
        }
      }
    })
  }
}

const policeListDefaults = () => ({
  autocomplete: forms.preventAutocomplete,
  errors: []
})

module.exports = {
  summaryList,
  policeListDefaults
}
