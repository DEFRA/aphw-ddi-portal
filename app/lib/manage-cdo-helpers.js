const { statuses } = require('../constants/cdo/status')

const useManageCdo = cdo => [statuses.PreExempt, statuses.Failed].includes(cdo?.dog?.status)

const redirectManageCdo = (cdo, force) => useManageCdo(cdo) && force !== 'true'

module.exports = {
  useManageCdo,
  redirectManageCdo
}
