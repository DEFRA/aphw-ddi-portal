/**
 * @param {Partial<PoliceForceDto>} policeForcePartial
 * @return {PoliceForceDto}
 */
const buildPoliceForce = policeForcePartial => ({
  id: 1,
  name: 'Sandford Police',
  ...policeForcePartial
})

module.exports = {
  buildPoliceForce
}
