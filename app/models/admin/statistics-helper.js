const countries = ['England', 'Wales', 'Scotland']

const sumTotals = (counts) => {
  return counts.map(row => row.total).reduce((a, b) => a + b)
}

const prepareCountryCounts = (countsPerCountry) => {
  const rowsPerCountry = {}
  countries.forEach(country => {
    rowsPerCountry[country] = countsPerCountry.filter(row => row.country === country)
  })

  const totalsPerCountry = {}
  countries.forEach(country => {
    totalsPerCountry[country] = sumTotals(rowsPerCountry[country])
  })

  const totalsPerBreed = {}
  const rowsPerBreed = {}
  const breeds = []
  countsPerCountry.forEach(row => {
    if (!breeds.includes(row.breed)) {
      breeds.push(row.breed)
    }
  })

  breeds.forEach(breed => {
    const rows = countsPerCountry.filter(row => row.breed === breed)
    totalsPerBreed[breed] = sumTotals(rows)
    rowsPerBreed[breed] = rows
  })

  return { breeds, countries, rowsPerBreed, totalsPerCountry, totalsPerBreed }
}

module.exports = {
  sumTotals,
  prepareCountryCounts
}
