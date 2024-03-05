const { forms } = require('../../constants/forms')

/**
 * @typedef CountrySelectorItem
 * @property {string} text
 * @property {string} value
 * @property {boolean} [selected]
 */

/**
 * @typedef CountrySelector
 * @property {string} id
 * @property {string} name
 * @property {string} value
 * @property {CountrySelectorItem[]} items
 * @property {string} autocomplete
 */

/**
 * @typedef GovUkSelectItemAttributes
 * @property {string} [maxLength]
 */
/**
 * @typedef JoiErrorDetail
 * @property {string} details
 * @property {string[]} path
 * @property {string} message
 * @property {string} type
 * @property {{ label: string; value: string; key: string; }} context
 */

/**
 * @typedef GovUkErrorMessage
 * @property {string} text
 */
/**
 * @typedef GovUkSelectItem
 * @property {string} id
 * @property {string} name
 * @property {string} value
 * @property {{ text: string }} [label]
 * @property {string} [classes]
 * @property {string} autocomplete
 * @property {GovUkSelectItemAttributes} [attributes]
 * @property {*[]} items
 * @property {GovUkErrorMessage} [errorMessage]
 */

/**
 * @param {string[]} countries
 * @param {Joi.ValidationError} validationError
 * @param {string} selectedCountry
 * @returns {GovUkSelectItem}
 */
const mapToCountrySelector = (countries, validationError, selectedCountry = '') => {
  /**
   * @type {CountrySelectorItem[]}
   */
  const countriesConcat = countries.map(country => ({
    value: country,
    text: country
  }))

  /**
   * @type {CountrySelectorItem[]}
   */
  const items = [{ text: 'Choose country', value: '', selected: true }].concat(countriesConcat)

  /**
   * @type {{}|{ errorMessage: GovUkErrorMessage }}
   */
  const errorMessage = (validationError?.details || []).reduce((errorMessage, error) => {
    if (error.path[0] === 'country') {
      return {
        errorMessage: {
          text: error.message
        }
      }
    }
    return errorMessage
  }, {})

  return {
    id: 'country',
    name: 'country',
    value: selectedCountry,
    label: {
      text: 'Country'
    },
    items,
    autocomplete: forms.preventAutocomplete,
    ...errorMessage
  }
}

module.exports = {
  mapToCountrySelector
}
