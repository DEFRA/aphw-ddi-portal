/**
 * @param {{ indexNumber: string; email: string }} data
 * @param backNav
 * @param errors
 * @constructor
 */
function ViewModel (data, backNav, errors) {
  this.model = {
    srcHashParam: backNav.srcHashParam,
    indexNumber: data.indexNumber,
    email: data.email
  }
}

module.exports = ViewModel
