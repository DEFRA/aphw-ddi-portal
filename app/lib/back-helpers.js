const { v4: uuidv4 } = require('uuid')
const { setInSession, getFromSession } = require('../session/session-wrapper')

const generateCurrentHashParam = (request) => {
  const id = uuidv4()
  const urlHashRef = id.split('-').shift().toLocaleLowerCase('en-GB').match(/.{1,4}/g).join('-')
  setInSession(request, `back-url-${urlHashRef}`, request.url.href)
  return `?src=${urlHashRef}`
}

const extractBackNavParam = (request) => {
  const refererUrl = request?.headers?.referer
  if (refererUrl && refererUrl.indexOf('?src=')) {
    const origSrc = refererUrl.substring(refererUrl.indexOf('?src=') + 5)
    const prevUrl = getFromSession(request, `back-url-${origSrc}`)
    if (prevUrl && prevUrl.indexOf('?src=')) {
      return prevUrl.substring(prevUrl.indexOf('?src='))
    }
  }
  return ''
}

const getPreviousUrl = (request) => {
  const url = getFromSession(request, `back-url-${request?.query?.src}`)
  return url ?? '/'
}

const addBackNavigation = (request) => {
  const currentHashParam = generateCurrentHashParam(request)
  const backLinkUrl = getPreviousUrl(request)
  return {
    backLink: backLinkUrl,
    srcHashParam: currentHashParam
  }
}

module.exports = {
  addBackNavigation,
  extractBackNavParam
}
