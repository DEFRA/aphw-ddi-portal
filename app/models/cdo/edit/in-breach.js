const { errorPusherDefault } = require('../../../lib/error-helpers')
/**
 * @param dog
 * @param {BreachCategory[]} breachCategories
 * @param {string[]} selectedBreachCategories
 * @param backNav
 * @param [errors]
 * @constructor
 */
function ViewModel (dog, breachCategories, selectedBreachCategories, backNav, errors) {
  /**
   * @type {{
   * dogBreaches: GovukCheckBox,
   * backLink,
   * indexNumber,
   * srcHashParam,
   * errors: *[]}}
   */
  this.model = {
    backLink: backNav.backLink,
    srcHashParam: backNav.srcHashParam,
    indexNumber: dog.indexNumber,
    dogBreaches: {
      items: breachCategories.map(breachCategory => ({
        value: breachCategory.short_name,
        text: breachCategory.label,
        checked: selectedBreachCategories.some(selectedCategory => breachCategory.short_name === selectedCategory)
      })),
      name: 'dogBreaches',
      fieldset: {
        legend: {
          classes: 'govuk-fieldset__legend--l',
          isPageHeading: true,
          text: 'What is the reason for the breach?'
        }
      },
      hint: {
        text: 'Select all that apply.'
      }
    },
    errors: []
  }
  errorPusherDefault(errors, this.model)
}

module.exports = ViewModel
