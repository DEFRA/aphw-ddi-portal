import Page from './page'

class Email extends Page {
  /**
  * define elements
  */
  get serviceName () { return $('//.govuk-header__link--service-name') }
  get headingQuestion () { return $('//.govuk-fieldset__heading') }
  get questionHint () { return $('//.govuk-label') }
  get emailField () { return $('#email') }
  get submitButton () { return $('.govuk-button') }
  get unavailableService () { return $('.govuk-heading-xl') }
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
  enterEmail () {
    this.emailField.clearValue()
    this.emailField.setValue('dean.draper@defra.gov.uk')
    browser.pause(1000)
  }
}
export default new Email()
