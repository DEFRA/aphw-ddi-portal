const { forms } = require('../../constants/forms')

/**
 * @param {string[]} countries
 * @returns {import('./countries').CountrySelector}
 */
const mapToCountrySelector = (countries) => {
  /**
   * @type {import('./countries').CountrySelectorItem[]}
   */
  const countriesConcat = countries.map(country => ({
    value: country,
    text: country
  }))

  /**
   * @type {import('./countries').CountrySelectorItem[]}
   */
  const items = [{ text: 'Choose country', value: '', selected: true }].concat(countriesConcat)

  return {
    id: 'country',
    name: 'country',
    value: '',
    items,
    autocomplete: forms.preventAutocomplete
  }
}

module.exports = {
  mapToCountrySelector
}
