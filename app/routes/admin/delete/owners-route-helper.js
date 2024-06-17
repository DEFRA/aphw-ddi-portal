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
  const sortKey = request.payload?.checkboxSortCol ?? (params.sortKey ?? 'selected')
  return `?sortKey=${sortKey}&sortOrder=${toggledSortOrder}`
}

module.exports = {
  handleCheckboxSort,
  getCheckboxSortQueryString
}
