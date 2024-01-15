const { v4: uuidv4 } = require('uuid')
const { setInSession, getFromSession } = require('../session/session-wrapper')

const generateCurrentHashParam = (request) => {
  const id = uuidv4()
  const urlHashRef = id.split('-').shift().toLocaleLowerCase('en-GB').match(/.{1,4}/g).join('-')
  setInSession(request, `back-url-${urlHashRef}`, request.url.href)
  return `?src=${urlHashRef}`
}

const extractSrcParamFromUrl = (url, removPrefix) => {
  if (url && url.indexOf('?src=') > -1) {
    const origSrc = url.substring(url.indexOf('?src='))
    return removPrefix ? origSrc.substring(origSrc.indexOf('?src=') + 5) : origSrc.substring(origSrc.indexOf('?src='))
  }
  return ''
}

const extractSrcParamFromReferer = (request, removPrefix) => {
  return extractSrcParamFromUrl(request?.headers?.referer, removPrefix)
}

const extractBackNavParam = (request, removPrefix) => {
  const origSrc = extractSrcParamFromReferer(request, true)
  const prevUrl = origSrc !== '' ? getFromSession(request, `back-url-${origSrc}`) : getFromSession(request, 'last-referer')
  if (prevUrl && prevUrl.indexOf('?src=')) {
    return removPrefix ? prevUrl.substring(prevUrl.indexOf('?src=') + 5) : prevUrl.substring(prevUrl.indexOf('?src='))
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

const addBackNavigationForErrorCondition = (request) => {
  const srcParam = extractSrcParamFromReferer(request, true)
  let backLinkUrl
  if (srcParam === '') {
    backLinkUrl = getFromSession(request, 'last-referer') ?? '/'
  } else {
    backLinkUrl = getFromSession(request, `back-url-${srcParam}`) ?? '/'
    if (backLinkUrl !== '/') {
      setInSession(request, 'last-referer', backLinkUrl)
    }
  }

  return {
    backLink: backLinkUrl,
    srcHashParam: extractSrcParamFromUrl(backLinkUrl)
  }
}

module.exports = {
  addBackNavigation,
  extractBackNavParam,
  addBackNavigationForErrorCondition
}
