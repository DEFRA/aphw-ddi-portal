let DOMPurify

const initialiseDOMPurify = () => {
  if (DOMPurify === undefined) {
    const { JSDOM } = require('jsdom')
    const createDomPurify = require('dompurify')

    const window = new JSDOM('').window
    DOMPurify = createDomPurify(window)
  }
}
const sanitiseText = emailString => {
  if (!emailString) {
    return ''
  }

  initialiseDOMPurify()

  return DOMPurify.sanitize(emailString, {
    ALLOWED_TAGS: ['#text'], // only <P> and text nodes
    KEEP_CONTENT: false, // remove content from non-allow-listed nodes too
    RETURN_DOM: false // return a document object instead of a string
  })
}
module.exports = {
  sanitiseText
}
