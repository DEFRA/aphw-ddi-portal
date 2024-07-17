const { get } = require('./base')

const dogBreachesEndpoint = 'breaches'

const options = {
  json: true
}

/**
 * @typedef BreachCategory
 * @property {number} id
 * @property {string} label
 * @property {string} short_name
 */

/**
 * @return {Promise<BreachCategory[]>}
 */
const getBreachCategories = async () => {
  const payload = await get(`${dogBreachesEndpoint}/categories`, options)

  const breachCategories = payload.breachCategories.map(breachCategory => {
    const [head, ...tail] = breachCategory.label
    const label = head.toUpperCase() + tail.join('')

    return {
      ...breachCategory,
      label
    }
  })
  return breachCategories
}

module.exports = {
  getBreachCategories
}
