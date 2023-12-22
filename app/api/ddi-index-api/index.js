const { getCounties } = require('./counties')
const { getCountries } = require('./countries')
const { getBreeds } = require('./dog-breeds')
const { getCourts } = require('./courts')
const { getPoliceForces } = require('./police-forces')
const { getCompanies } = require('./insurance')
const cdo = require('./cdo')
const people = require('./person')
const dog = require('./dog')

module.exports = {
  getCounties,
  getCountries,
  getBreeds,
  getCourts,
  getPoliceForces,
  getCompanies,
  cdo,
  people,
  dog
}
