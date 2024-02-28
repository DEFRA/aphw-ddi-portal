import Page from './page'

class PropertyType extends Page {
  // define elements
  get startNewClaim () { return $('//button[contains(., "Start new claim")]') }
  get saveAndContinueButton () { return $('//button[contains(., "Save and continue")]') }
  get propertyStillAccessible () { return $('//h1[contains(., "Is the property still accessible?")]') }
  get homeRadioButton () { return $('#propertyType') }
  get businessRadioButton () { return $('//*[(@id = "propertyType-2")]') }

  // define or overwrite page methods
  open () {
    super.open('claim/property-type')
    browser.pause(3000)
  }

  //  page specific methods
  async selectHomeRadioBtn () {
    await browser.execute('(await this.homeRadioButton).click()')
  }

  selectHomeRadioButton () {
    const element = $('#propertyType')
    browser.execute('arguments[0].click();', element)
  }

  selectBusinessRadioButton () {
    const element = $('#propertyType-2')
    browser.execute('arguments[1].click();', element)
  }

  async clickElementText (test) {
    const text = (test).getElementText()
    return text
  }

  waitForloginPageToLoad () {
    if (!this.homeRadioButton.isDisplayed()) {
      this.homeRadioButton.waitForDisplayed(10000)
    }
  }
}
export default new PropertyType()
