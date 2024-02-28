import Page from './page'

class MineType extends Page {
  /**
    * define elements
    */
  get serviceName () { return $('//.govuk-header__link--service-name') }
  get headingQuestion () { return $('//.govuk-fieldset__heading') }
  get questionHint () { return $('//#mineType-hint') }
  get coalCheckBox () { return $('//*[(@id = "mineType-1")]') }
  get ironCheckBox () { return $('//*[(@id = "mineType-2")]') }
  get goldCheckBox () { return $('//*[(@id = "mineType-3")]') }
  get otherCheckBox () { return $('//*[(@id = "mineType-4")]') }
  get saveAndContinueButton () { return $('.govuk-button') }
  /**
     * define or overwrite page methods
     */
  open () {
    super.open('')
    browser.pause(3000)
  }
  /**
     * your page specific methods
     */

  selectCoalCheckBox () {
    const element = $('#mineType')
    browser.execute('arguments[0].click();', element)
  }

  selectGoldCheckBox () {
    const element = $('#mineType-2')
    browser.execute('arguments[1].click();', element)
  }
}
export default new MineType()
