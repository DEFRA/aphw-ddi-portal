const { get } = require('./base')

const dogBreachesEndpoint = 'breaches'

const options = {
  json: true
}

const getBreachCategories = async () => {
  const payload = await get(`${dogBreachesEndpoint}/categories`, options)

  return payload.breachCategories
}

module.exports = {
  getBreachCategories
}
