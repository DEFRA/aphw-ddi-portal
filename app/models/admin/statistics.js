const { formatNumberWithCommas } = require('../../lib/format-helpers')

function ViewModel (counts) {
  this.model = {
    counts,
    total: counts.map(row => row.total).reduce((a, b) => a + b),
    formatWithCommas: formatNumberWithCommas
  }
}

module.exports = ViewModel
