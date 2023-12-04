const { getCounties } = require('./counties')
const { getCountries } = require('./countries')
const { getBreeds } = require('./dog-breeds')
const { getCourts } = require('./courts')
const { getPoliceForces } = require('./police-forces')

module.exports = {
  getCounties,
  getCountries,
  getBreeds,
  getCourts,
  getPoliceForces
}
