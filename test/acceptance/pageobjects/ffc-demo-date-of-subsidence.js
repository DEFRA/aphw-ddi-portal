import Page from './page'

class DateOfSubsidence extends Page {
  /**
    * define elements
    */
  get serviceName () { return $('//.govuk-header__link--service-name') }
  get headingQuestion () { return $('//.govuk-fieldset__heading') }
  get questionHint () { return $('//#date-of-subsidence-hint') }
  get subsidenceDay () { return $('#date-of-subsidence-day') }
  get subsidenceMonth () { return $('#date-of-subsidence-month') }
  get subsidenceYear () { return $('#date-of-subsidence-year') }
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
  enterDay (day) {
    this.subsidenceDay.clearValue()
    this.subsidenceDay.setValue(day)
    browser.pause(1000)
  }

  enterMonth (month) {
    this.subsidenceMonth.clearValue()
    this.subsidenceMonth.setValue(month)
    browser.pause(1000)
  }

  enterYear (year) {
    this.subsidenceYear.clearValue()
    this.subsidenceYear.setValue(year)
    browser.pause(1000)
  }
}
export default new DateOfSubsidence()
