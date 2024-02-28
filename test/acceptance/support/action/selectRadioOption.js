import checkIfElementExists from '../lib/checkIfElementExists'

/**
 * Perform an radio option select action on the given radio element and option
 * @param  {String}   optionValue  option value (not 'display text')
 * @param  {String}   radioName  The radio element name
 */
export default (optionValue, radioName) => {
  /**
     * Element to perform the action on
     * @type {String}
     */
  const selector2 = `//input[@type='radio' and @name='${radioName}' and @value='${optionValue}']`

  checkIfElementExists(selector2)

  $(selector2)['click']()
}
