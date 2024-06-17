const { formatNumberWithCommas } = require('../../lib/format-helpers')
const { getStatsTimestamp } = require('../../lib/date-helpers')

function ViewModel (counts) {
  this.model = {
    counts,
    total: counts.map(row => row.total).reduce((a, b) => a + b),
    formatWithCommas: formatNumberWithCommas,
    timestamp: getStatsTimestamp()
  }
}

module.exports = ViewModel
