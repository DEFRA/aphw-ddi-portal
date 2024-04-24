function ViewModel (results) {
  this.model = {
    errors: results?.errors,
    rows: mapRows(results?.rows),
    log: results?.log
  }
}

const mapRows = (rows) => {
  return rows
    ? rows.map((row, index) => ({
        rowNumber: index + 1,
        ownerName: `${row.owner.firstName} ${row.owner.lastName}`,
        dogName: row.dogs[0].name,
        postcode: row.owner.address.postcode
      }))
    : []
}

module.exports = ViewModel
