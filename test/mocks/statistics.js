const statsPerStatusRows = [
  { total: 20, status: { id: 4, name: 'Interim exempt' } },
  { total: 30, status: { id: 5, name: 'Applying for exemption' } },
  { total: 40, status: { id: 6, name: 'Failed to exempt dog' } },
  { total: 5000, status: { id: 7, name: 'Exempt' } },
  { total: 60, status: { id: 8, name: 'In breach' } },
  { total: 70, status: { id: 9, name: 'Withdrawn by owner' } },
  { total: 1000, status: { id: 10, name: 'Inactive' } }
]

const statsPerCountryRows = [
  { breed: 'XL Bully', country: 'England', total: 55 },
  { breed: 'XL Bully', country: 'Wales', total: 2 },
  { breed: 'XL Bully', country: 'Scotland', total: 30 },
  { breed: 'Breed 2', country: 'England', total: 257 },
  { breed: 'Breed 2', country: 'Wales', total: 44 },
  { breed: 'Breed 2', country: 'Scotland', total: 10 },
  { breed: 'Breed 3', country: 'England', total: 128 },
  { breed: 'Breed 3', country: 'Wales', total: 15 },
  { breed: 'Breed 3', country: 'Scotland', total: 33 }
]

module.exports = {
  statsPerStatusRows,
  statsPerCountryRows
}
