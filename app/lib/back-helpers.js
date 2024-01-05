const { v4: uuidv4 } = require('uuid')
const { setInSession, getFromSession } = require('../session/session-wrapper')

const generateCurrentHashParam = (request) => {
  const id = uuidv4()
  const urlHashRef = id.split('-').shift().toLocaleLowerCase('en-GB').match(/.{1,4}/g).join('-')
  setInSession(request, `back-url-${urlHashRef}`, request.url.href)
  return `?src=${urlHashRef}`
}

const getPreviousUrl = (request) => {
  const url = getFromSession(request, `back-url-${request?.query?.src}`)
  return url ?? '/'
}

const addBackNavigation = (model, request) => {
  const currentHashParam = generateCurrentHashParam(request)
  const backLinkUrl = getPreviousUrl(request)
  model.backLink = backLinkUrl
  model.srcHashParam = currentHashParam
}

module.exports = {
  addBackNavigation
}
