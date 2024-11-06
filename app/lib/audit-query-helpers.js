const getFieldLabel = (queryType) => {
  if (queryType === 'user') {
    return 'Username'
  } else if (queryType === 'search') {
    return 'Search term(s)'
  } else if (queryType === 'dog') {
    return 'Dog index number'
  } else if (queryType === 'owner') {
    return 'Owner reference'
  } else {
    return ''
  }
}

const getFieldHint = (queryType) => {
  if (queryType === 'search') {
    return 'Enter one or more search terms separated by commas'
  } else if (queryType === 'dog') {
    return 'For example ED012345'
  } else if (queryType === 'owner') {
    return 'For example P-1234-5678. This can be found within the URL of a \'view owner details\' page'
  } else if (queryType === 'user') {
    return 'The username is the user\'s email address'
  } else {
    return ''
  }
}

const columnNames = {
  user: ['Action', 'Key'],
  search: ['Search terms', 'Username'],
  dog: ['Action', 'Username'],
  owner: ['Action', 'Username'],
  login: ['Operating system and browser', 'Username'],
  date: ['Action', 'Key', 'Username']
}

const mapEventType = (eventType) => {
  if (eventType === 'uk.gov.defra.ddi.event.external.search') {
    return 'Search'
  }
  if (eventType === 'uk.gov.defra.ddi.event.external.view.dog') {
    return 'View dog'
  }
  if (eventType === 'uk.gov.defra.ddi.event.external.view.dog.activity') {
    return 'Check activity on dog'
  }
  if (eventType === 'uk.gov.defra.ddi.event.external.view.owner') {
    return 'View owner'
  }
  if (eventType === 'uk.gov.defra.ddi.event.external.view.owner.activity') {
    return 'Check activity on owner'
  }
  return 'Unknown'
}

const getExtraColumnFunctions = (queryType) => {
  if (queryType === 'user') {
    return [
      (row) => mapEventType(row?.type),
      (row) => row?.details?.searchTerms ? row?.details?.searchTerms : row?.details?.pk
    ]
  }
  if (queryType === 'search') {
    return [
      (row) => row?.details?.searchTerms,
      (row) => row?.username
    ]
  }
  if (queryType === 'date') {
    return [
      (row) => mapEventType(row?.type),
      (row) => row?.details?.searchTerms ? row?.details?.searchTerms : row?.details?.pk,
      (row) => row?.username]
  }
  if (queryType === 'login') {
    return [
      (row) => row?.details?.userAgent,
      (row) => row?.username]
  }
  if (queryType === 'dog') {
    return [
      (row) => mapEventType(row?.type),
      (row) => row?.username]
  }
  if (queryType === 'owner') {
    return [
      (row) => mapEventType(row?.type),
      (row) => row?.username]
  }
}

const getExtraColumnNames = (queryType) => {
  return columnNames[queryType]
}

const eitherDateIsPopulated = (details) => {
  return details?.fromDate || details?.toDate
}

const getNumberFoundText = (results) => {
  if (!results || results.length === 0) {
    return 'No records found'
  } else if (results.length === 1) {
    return '1 record found'
  } else {
    return `${results.length} records found`
  }
}

module.exports = {
  getFieldHint,
  getFieldLabel,
  getExtraColumnFunctions,
  getExtraColumnNames,
  eitherDateIsPopulated,
  getNumberFoundText,
  mapEventType
}
