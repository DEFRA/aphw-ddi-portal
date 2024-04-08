/**
 * @param {MappedUser[]} pseudonyms
 * @constructor
 */
function ViewModel (pseudonyms) {
  this.model = {
    backLink: '/admin/index',
    pseudonyms
  }
}

module.exports = ViewModel
