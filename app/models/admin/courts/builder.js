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

const PoliceOffersAddedViewModel = (officers) => {
  return new ViewModel({
    titleHtml: 'You gave police officers access to the Index',
    html: [
      {
        h2: true,
        text: 'What happens next'
      },
      {
        p: true,
        text: 'These police officers will receive an email invitation to access the Dangerous Dogs Index:'
      },
      {
        ul: officers.map(policeOfficer => ({
          text: policeOfficer
        }))
      }
    ],
    bodyContent: []
  })
}

module.exports = {
  CourtAddedViewModel,
  CourtRemovedViewModel,
  PoliceOffersAddedViewModel
}
