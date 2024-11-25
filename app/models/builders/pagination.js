const { pagination } = require('../../constants/search')

const calcMidSectionStart = (numOfPages, currentPage) => {
  const startPos = currentPage - 1
  if (startPos <= 1) {
    return 2
  }
  if (startPos + 3 >= numOfPages) {
    return Math.max(numOfPages - 3, 2)
  }
  return startPos
}

const stripPageParam = (url) => {
  const foundPos = url.indexOf('&page=')
  if (foundPos === -1) {
    return url
  }
  return url.substr(0, foundPos)
}

const getPage = (baseUrl, pageNum, currentPage) => (
  {
    number: pageNum,
    href: `${baseUrl}&page=${pageNum}`,
    current: currentPage === pageNum
  }
)

const addPageNumbers = (numOfPages, currentPage, baseUrl) => {
  const pages = [getPage(baseUrl, 1, currentPage)]

  const midSectionStart = calcMidSectionStart(numOfPages, currentPage)
  const midSectionEnd = midSectionStart + 2

  if (midSectionStart > 2) {
    pages.push({ ellipsis: true })
  }

  for (let i = midSectionStart; i < midSectionEnd + 1; i++) {
    if (i < numOfPages) {
      pages.push(getPage(baseUrl, i, currentPage))
    }
  }

  if (midSectionEnd < numOfPages - 1) {
    pages.push({ ellipsis: true })
  }

  pages.push(getPage(baseUrl, numOfPages, currentPage))

  return pages
}

const getPrevious = (currentPage, baseUrl) => {
  return currentPage === 1 ? undefined : { href: `${baseUrl}&page=${currentPage - 1}` }
}

const getNext = (currentPage, baseUrl, numOfPages) => {
  return currentPage === numOfPages ? undefined : { href: `${baseUrl}&page=${currentPage + 1}` }
}

const buildPagination = (results, baseUrl) => {
  const numOfPages = Math.ceil(results.totalFound / pagination.resultsPerPage)
  if (numOfPages <= 1) {
    return undefined
  }
  baseUrl = stripPageParam(baseUrl)

  const currentPage = results.page

  return {
    previous: getPrevious(currentPage, baseUrl),
    items: addPageNumbers(numOfPages, currentPage, baseUrl),
    next: getNext(currentPage, baseUrl, numOfPages)
  }
}

const buildRecordRangeText = (pageNum, totalFound) => {
  if (!pageNum || isNaN(pageNum)) {
    return `1 to ${Math.min(totalFound, pagination.resultsPerPage)}`
  }
  return `${((pageNum - 1) * pagination.resultsPerPage) + 1} to ${Math.min(totalFound, pageNum * pagination.resultsPerPage)}`
}

const buildTitle = (results) => {
  const numOfPages = Math.ceil(results.totalFound / pagination.resultsPerPage)
  if (numOfPages <= 1) {
    return `Search results - ${results.totalFound} records found`
  }
  const rangeText = buildRecordRangeText(results?.page, results.totalFound)
  return `Search results - Showing ${rangeText}`
}

module.exports = {
  buildPagination,
  buildRecordRangeText,
  buildTitle
}
