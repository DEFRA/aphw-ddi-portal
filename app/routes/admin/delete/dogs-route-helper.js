const { getDogsForDeletion } = require('../../../session/admin/delete-dogs')

const getCombinedSelectedList = (request) => {
  return getDogsForDeletion(request, 1).concat(getDogsForDeletion(request, 2))
}

const getDateOverrideQueryString = request => {
  const params = request.query
  return params.today ? `?today=${params.today}` : ''
}

const getCheckboxSortQueryString = request => {
  const params = request.query
  const paramStringPrefix = params.today ? '&' : '?'
  const toggledSortOrder = params.sortOrder === 'ASC' ? 'DESC' : 'ASC'
  const sortKey = request.payload?.checkboxSortCol ?? (params.sortKey ?? 'selected')
  const sortOrder = toggledSortOrder
  return `${paramStringPrefix}sortKey=${sortKey}&sortOrder=${sortOrder}`
}

const handleCheckboxSort = (request, dogs, selectedList) => {
  const params = request.query
  if (params.sortKey !== 'selected') {
    return dogs
  }
  const selectedDogs = dogs.filter(dog => selectedList.includes(dog.indexNumber))
  const unselectedDogs = dogs.filter(dog => !selectedList.includes(dog.indexNumber))
  return params.sortOrder === 'ASC' ? selectedDogs.concat(unselectedDogs) : unselectedDogs.concat(selectedDogs)
}

module.exports = {
  getCombinedSelectedList,
  getDateOverrideQueryString,
  getCheckboxSortQueryString,
  handleCheckboxSort
}
