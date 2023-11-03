import { WidgetInstance } from 'friendly-challenge'

let captureSitekey = ''

function doneCallback (solution) {
  console.log('CAPTCHA completed succesfully, solution:', solution)
}

const element = document.querySelector('#my-widget')
const options = {
  doneCallback: doneCallback,
  sitekey: captureSitekey
}
const widget = new WidgetInstance(element, options)

export function start (sitekey) {
  captureSitekey = sitekey
  widget.start()
}
