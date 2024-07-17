const { get, post } = require('./base')

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

  return payload.breachCategories.map(breachCategory => {
    const [head, ...tail] = breachCategory.label
    const label = head.toUpperCase() + tail.join('')

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
