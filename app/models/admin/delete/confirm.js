const { breadcrumbs } = require('../../../constants/admin')

const ViewModel = require('../success')

/**
 * @param {string[]} selectedList
 * @param backNav
 * @constructor
 */
function ConfirmViewModel (selectedList, backNav) {
  this.model = {
    backLink: backNav.backLink,
    selectedList
  }
}

const DogsRemovedViewModel = (count) => {
  return new ViewModel({
    breadcrumbs,
    titleHtml: count === 1 ? '1 dog record has been deleted' : `${count} dog records have been deleted`,
    bodyContent: [
      'Raise a support ticket within the next 90 days if you need to recover a deleted dog record.'
    ]
  })
}

const OwnersRemovedViewModel = (count) => {
  return new ViewModel({
    breadcrumbs,
    titleHtml: count === 1 ? '1 dog owner record has been deleted' : `${count} dog owner records have been deleted`,
    bodyContent: [
      'Raise a support ticket if you need to recover a deleted owner record.'
    ]
  })
}

module.exports = {
  ConfirmViewModel,
  DogsRemovedViewModel,
  OwnersRemovedViewModel
}
