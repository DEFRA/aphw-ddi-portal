const { forms } = require('../../../../constants/forms')
const { routes } = require('../../../../constants/admin')

const summaryList = (users, remove = false) => {
  const removeItems = (user, idx) => {
    return !remove
      ? []
      : [{
          text: 'Remove',
          visuallyHiddenText: `remove ${user}`,
          href: `${routes.addRemovePoliceUser.get}/${idx}`
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
          classes: 'govuk-!-width-one-third',
          items: [
            {
              text: 'Change',
              visuallyHiddenText: `Change ${user}`,
              href: `${routes.addUpdatePoliceUser.get}/${idx}`
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
