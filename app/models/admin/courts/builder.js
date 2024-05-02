const { routes } = require('../../../constants/admin')
const ViewModel = require('../success')

const breadcrumbs = [
  {
    label: 'Home',
    link: '/'
  },
  {
    label: 'Admin',
    link: routes.index.get
  }
]

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
      `${court} is removed from the Index and will not be available for new applications.`,
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
