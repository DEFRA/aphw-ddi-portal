/**
 * @param {MappedUser[]} pseudonyms
 * @constructor
 */
function ViewModel (pseudonyms) {
  this.model = {
    title: pseudonyms.length ? 'Add or remove pseudonyms' : 'Add a team member pseudonym',
    backLink: '/admin/index',
    pseudonyms
  }
}

module.exports = ViewModel
