const { get, post } = require('./base')

const dogBreachesEndpoint = 'breaches'

/**
 * @typedef BreachCategory
 * @property {number} id
 * @property {string} label
 * @property {string} short_name
 */

/**
 * @return {Promise<BreachCategory[]>}
 */
const getBreachCategories = async (user) => {
  const payload = await get(`${dogBreachesEndpoint}/categories`, user)

  return payload.breachCategories.map(breachCategory => {
    const [firstLetter, ...restOfLetters] = breachCategory.label
    const label = firstLetter.toUpperCase() + restOfLetters.join('')

    return {
      ...breachCategory,
      label
    }
  })
}

const setDogBreaches = async (requestPayload, user) => {
  const payload = await post(`${dogBreachesEndpoint}/dog:setBreaches`, requestPayload, user)
  return payload
}

module.exports = {
  getBreachCategories, setDogBreaches
}
