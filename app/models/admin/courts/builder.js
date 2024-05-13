const { routes, breadcrumbs } = require('../../../constants/admin')
const ViewModel = require('../success')

/**
 *
 * @param court
 * @return {*}
 */
const CourtAddedViewModel = (court) => {
  return new ViewModel({
    breadcrumbs,
    titleHtml: `You added<br /> ${court}`,
    bodyContent: [`${court} is available in the Index.`],
    bottomLink: {
      link: routes.courts.get,
      label: 'Add or remove a court'
    }
  })
}

const CourtRemovedViewModel = (court) => {
  return new ViewModel({
    breadcrumbs,
    titleHtml: `You removed<br /> ${court}`,
    bodyContent: [
      `${court} is removed from the Index.`,
      'Existing records are unchanged.'
    ],
    bottomLink: {
      link: routes.courts.get,
      label: 'Add or remove a court'
    }
  })
}

module.exports = {
  CourtAddedViewModel,
  CourtRemovedViewModel
}
