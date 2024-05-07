const { routes, breadcrumbs } = require('../../../constants/admin')
const ViewModel = require('../success')

/**
 *
 * @param policeForce
 * @return {*}
 */
const PoliceForceAddedViewModel = (policeForce) => {
  return new ViewModel({
    breadcrumbs,
    titleHtml: `You added<br /> ${policeForce}`,
    bodyContent: [`${policeForce} is available in the Index.`],
    bottomLink: {
      link: routes.courts.get,
      label: 'Add or remove a police force'
    }
  })
}

const CourtRemovedViewModel = (policeForce) => {
  return new ViewModel({
    breadcrumbs,
    titleHtml: `You removed<br /> ${policeForce}`,
    bodyContent: [
      `${policeForce} is removed from the Index and will not be available for new applications.`,
      'Existing records are unchanged.'
    ],
    bottomLink: {
      link: routes.courts.get,
      label: 'Add or remove a police force'
    }
  })
}

module.exports = {
  CourtAddedViewModel: PoliceForceAddedViewModel,
  CourtRemovedViewModel
}
