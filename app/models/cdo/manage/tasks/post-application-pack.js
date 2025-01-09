/**
 * @param {{
 *   indexNumber: string;
 *   firstName: string;
 *   lastName: string;
 *   addressLine1: string;
 *   addressLine2: string;
 *   town: string;
 *   postcode: string;
 * }} data
 * @param backNav
 * @constructor
 */
function ViewModel (data, backNav) {
  this.model = {
    srcHashParam: backNav.srcHashParam,
    indexNumber: data.indexNumber,
    firstName: data.firstName,
    lastName: data.lastName,
    addressLine1: data.addressLine1,
    addressLine2: data.addressLine2,
    town: data.town,
    postcode: data.postcode
  }
}

module.exports = ViewModel
