function ViewModel (results) {
  this.model = {
    errors: results?.errors,
    rows: mapRows(results?.rows),
    log: results?.log,
    numOwners: results?.rows?.length || 0,
    numDogs: countDogs(results?.rows)
  }
}

const mapRows = (rows) => {
  return rows
    ? rows.map((row, index) => ({
        ownerNumber: index + 1,
        ownerName: `${row.owner.firstName} ${row.owner.lastName}`,
        postcode: row.owner.address.postcode,
        dogs: row.dogs
      }))
    : []
}

const countDogs = (rows) => {
  let numDogs = 0

  if (rows) {
    rows.forEach(o => {
      numDogs += o.dogs.length || 0
    })
  }

  return numDogs
}

module.exports = ViewModel
