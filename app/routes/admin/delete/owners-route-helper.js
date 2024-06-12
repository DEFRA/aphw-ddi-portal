const handleCheckboxSort = (request, owners, selectedList) => {
  const params = request.query
  if (params.sortKey !== 'selected') {
    return owners
  }
  const selectedOwners = owners.filter(dog => selectedList.includes(dog.personReference))
  const unselectedOwners = owners.filter(dog => !selectedList.includes(dog.personReference))
  return params.sortOrder === 'ASC' ? selectedOwners.concat(unselectedOwners) : unselectedOwners.concat(selectedOwners)
}

const getCheckboxSortQueryString = request => {
  const params = request.query
  const toggledSortOrder = params.sortOrder === 'ASC' ? 'DESC' : 'ASC'
  const sortOrder = params.sortKey === 'selected' ? toggledSortOrder : 'ASC'
  return `?sortKey=selected&sortOrder=${sortOrder}`
}

module.exports = {
  handleCheckboxSort,
  getCheckboxSortQueryString
}
