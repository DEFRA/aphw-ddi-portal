/**
 * @typedef Link
 * @property {string} label
 * @property {string} link
 */

/**
 * @typedef SuccessDetails
 * @property {string} [successMessage]
 * @property {string} [titleHtml]
 * @property {string} bodyContent
 * @property {Link[]} breadcrumbs
 * @property {Link} bottomLink
 */
/**
 * @param {SuccessDetails} details
 * @param [errors]
 * @constructor
 */
function ViewModel (details) {
  this.model = {
    breadcrumbs: details.breadcrumbs,
    successMessage: details.successMessage,
    titleHtml: details.titleHtml,
    bodyContent: details.bodyContent,
    bottomLink: details.bottomLink
  }
}

module.exports = ViewModel
