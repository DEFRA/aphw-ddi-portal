/**
 * @param {Partial<UserAccount>} userPartial
 * @return {UserAccount}
 */
const buildUser = userPartial => ({
  id: 1,
  username: 'axel.foley@beverly-hills.police.gov',
  policeForceId: 3,
  policeForce: 'Beverly Hills Police Department',
  activated: false,
  active: false,
  createdAt: false,
  lastLogin: false,
  accepted: false,
  ...userPartial
})

module.exports = {
  buildUser
}
