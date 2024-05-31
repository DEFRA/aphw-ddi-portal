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
    titleHtml: `${count} dog records have been deleted`,
    bodyContent: [
      'Raise a support ticket if you need to recover a deleted dog record.'
    ]
  })
}

module.exports = {
  ConfirmViewModel,
  DogsRemovedViewModel
}
