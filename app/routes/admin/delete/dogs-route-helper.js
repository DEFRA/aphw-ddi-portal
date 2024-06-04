const { getDogsForDeletion } = require('../../../session/admin/delete-dogs')

const getCombinedSelectedList = (request) => {
  return getDogsForDeletion(request, 1).concat(getDogsForDeletion(request, 2))
}

const getDateOverrideQueryString = request => {
  return request.query.today ? `?today=${request.query.today}` : ''
}

const getCheckboxSortQueryString = request => {
  const paramStringPrefix = request.query.today ? '&' : '?'
  const sortOrder = request.query.sortKey === 'selected' ? (request.query.sortOrder === 'ASC' ? 'DESC' : 'ASC') : 'ASC'
  return `${paramStringPrefix}sortKey=selected&sortOrder=${sortOrder}`
}

const handleCheckboxSort = (request, dogs, selectedList) => {
  if (request.query.sortKey !== 'selected') {
    return dogs
  }
  const selectedDogs = dogs.filter(dog => selectedList.includes(dog.indexNumber))
  const unselectedDogs = dogs.filter(dog => !selectedList.includes(dog.indexNumber))
  return request.query.sortOrder === 'ASC' ? selectedDogs.concat(unselectedDogs) : unselectedDogs.concat(selectedDogs)
}

module.exports = {
  getCombinedSelectedList,
  getDateOverrideQueryString,
  getCheckboxSortQueryString,
  handleCheckboxSort
}
