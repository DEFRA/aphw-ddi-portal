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

const mapEventLinkType = (eventType) => {
  if (eventType === 'uk.gov.defra.ddi.event.external.view.dog') {
    return 'dog-details'
  }
  if (eventType === 'uk.gov.defra.ddi.event.external.view.dog.activity') {
    return 'dog-details'
  }
  if (eventType === 'uk.gov.defra.ddi.event.external.view.owner') {
    return 'owner-details'
  }
  if (eventType === 'uk.gov.defra.ddi.event.external.view.owner.activity') {
    return 'owner-details'
  }
  return 'Other'
}

const displaySearchCriteria = (row) => {
  const keys = Object.keys(row?.details)
  const flags = []
  keys.forEach(key => {
    if (key === 'fuzzy' && !!row.details.fuzzy) {
      flags.push('fuzzy')
    } else if (key === 'national') {
      flags.push(row.details.national ? 'national' : 'local')
    }
  })
  if (flags.length) {
    return `${row?.details?.searchTerms} (${flags.join(', ')})`
  } else {
    return row?.details?.searchTerms
  }
}

const getExtraColumnFunctions = (queryType) => {
  if (queryType === 'user') {
    return [
      (row) => ({ text: mapEventType(row?.type) }),
      (row) => row?.details?.searchTerms ? ({ text: row?.details?.searchTerms }) : ({ linkPk: row?.details?.pk, linkType: mapEventLinkType(row?.type) })
    ]
  }
  if (queryType === 'search') {
    return [
      (row) => ({ text: displaySearchCriteria(row) }),
      (row) => ({ text: row?.username })
    ]
  }
  if (queryType === 'date') {
    return [
      (row) => ({ text: mapEventType(row?.type) }),
      (row) => row?.details?.searchTerms ? ({ text: displaySearchCriteria(row) }) : ({ linkPk: row?.details?.pk, linkType: mapEventLinkType(row?.type) }),
      (row) => ({ text: row?.username })
    ]
  }
  if (queryType === 'login') {
    return [
      (row) => ({ text: row?.details?.userAgent }),
      (row) => ({ text: row?.username })
    ]
  }
  if (queryType === 'dog') {
    return [
      (row) => ({ text: mapEventType(row?.type) }),
      (row) => ({ text: row?.username })
    ]
  }
  if (queryType === 'owner') {
    return [
      (row) => ({ text: mapEventType(row?.type) }),
      (row) => ({ text: row?.username })
    ]
  }
  return [
    () => ({ text: 'unknown' }),
    () => ({ text: 'unknown' }),
    () => ({ text: 'unknown' })
  ]
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
  mapEventType,
  mapEventLinkType
}
