const { formatNumberWithCommas } = require('../../lib/format-helpers')
const { getStatsTimestamp } = require('../../lib/date-helpers')
const { prepareCountryCounts, sumTotals } = require('./statistics-helper')

function ViewModel (countsPerStatus, countsPerCountry) {
  const scotCells = countsPerCountry.filter(row => row.country === 'Scotland' && row.breed === 'XL Bully')
  if (scotCells?.[0]) {
    scotCells[0].total = 0
  }

  const { breeds, countries, rowsPerBreed, totalsPerCountry, totalsPerBreed } = prepareCountryCounts(countsPerCountry)

  this.model = {
    countsPerStatus: {
      counts: countsPerStatus,
      total: sumTotals(countsPerStatus)
    },
    countsPerCountry: {
      countries,
      breeds,
      rowsPerBreed,
      totalsPerCountry,
      total: sumTotals(countsPerCountry),
      totalsPerBreed
    },
    formatWithCommas: formatNumberWithCommas,
    timestamp: getStatsTimestamp()
  }
}

module.exports = ViewModel
