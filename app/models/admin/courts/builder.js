const { routes } = require('../../../constants/admin')
const ViewModel = require('../success')

/**
 *
 * @param court
 * @return {*}
 */
const CourtAddedViewModel = (court) => {
  return new ViewModel({
    breadcrumbs: [
      {
        label: 'Home',
        link: '/'
      },
      {
        label: 'Admin',
        link: routes.index.get
      }
    ],
    titleHtml: `You added<br /> ${court}`,
    bodyContent: `${court} is available in the Index.`,
    bottomLink: {
      link: routes.courts.get,
      label: 'Add or remove a court'
    }
  })
}

module.exports = {
  CourtAddedViewModel
}
