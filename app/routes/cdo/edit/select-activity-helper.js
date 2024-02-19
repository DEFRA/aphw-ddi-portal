const { getMainReturnPoint } = require('../../../lib/back-helpers')

const backNav = (details, request) => {
  const srcParam = details.srcHashParam ? '?src=' + details.srcHashParam : ''
  return {
    backLink: details.skippedFirstPage === 'true'
      ? getMainReturnPoint(request)
      : `/cdo/edit/add-activity/${details.pk}/${details.source}${srcParam}`
  }
}

module.exports = {
  backNav
}
