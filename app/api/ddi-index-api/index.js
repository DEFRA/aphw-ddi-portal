const { getCounties } = require('./counties')
const { getCountries } = require('./countries')
const { getCourts } = require('./courts')
const { getPoliceForces } = require('./police-forces')

module.exports = {
  getCounties,
  getCountries,
  getCourts,
  getPoliceForces
}
