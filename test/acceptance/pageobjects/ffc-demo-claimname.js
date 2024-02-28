import Page from './page'

class ClaimName extends Page {
  /**
  * define elements
  */
  get claimNameInput () { return $('//input[@id="name"]') }
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
  waitForloginPageToLoad () {
    if (!this.headerImage.isDisplayed()) {
      this.headerImage.waitForDisplayed(10000)
    }
  }

  async claimName () {
    await (await this.claimNameInput).addValue('kaz')
  }
}
export default new ClaimName()
