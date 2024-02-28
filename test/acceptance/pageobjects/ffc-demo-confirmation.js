import Page from './page'

class Confirmation extends Page {
  /**
    * define elements
    */
  get applicationComplete () { return $('h1=Application complete') }
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
  checkApplicationComplete () {
    this.applicationComplete.waitForDisplayed(1000)
    return this.applicationComplete.isDisplayed()
  }
}
export default new Confirmation()
