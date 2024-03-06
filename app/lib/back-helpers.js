const { v4: uuidv4 } = require('uuid')
const { setInSession, getFromSession } = require('../session/session-wrapper')

const lastHashParam = 'last-hash-param'
const srcPrefix = '?src='
const backUrl = 'back-url-'
const lastReferer = 'last-referer'
const mainReturnPoint = 'main-return-point'

const generateCurrentHashParam = (request) => {
  const id = uuidv4()
  const urlHashRef = id.split('-').shift().toLocaleLowerCase('en-GB').match(/.{1,4}/g).join('-')
  setInSession(request, `${backUrl}${urlHashRef}`, request.url.href)
  return urlHashRef
}

const extractSrcParamFromUrl = (url, removPrefix) => {
  if (url && url.indexOf(srcPrefix) > -1) {
    const origSrc = url.substring(url.indexOf(srcPrefix))
    return removPrefix ? origSrc.substring(origSrc.indexOf(srcPrefix) + 5) : origSrc.substring(origSrc.indexOf(srcPrefix))
  }
  return ''
}

const extractSrcParamFromReferer = (request, removPrefix) => {
  return extractSrcParamFromUrl(request?.headers?.referer, removPrefix)
}

const extractBackNavParam = (request, removPrefix) => {
  const origSrc = extractSrcParamFromReferer(request, true)
  const prevUrl = origSrc !== '' ? getFromSession(request, `${backUrl}${origSrc}`) : getFromSession(request, lastReferer)
  if (prevUrl && prevUrl.indexOf(srcPrefix) > -1) {
    return removPrefix ? prevUrl.substring(prevUrl.indexOf(srcPrefix) + 5) : prevUrl.substring(prevUrl.indexOf(srcPrefix))
  }
  return ''
}

const getPreviousUrl = (request) => {
  const url = getFromSession(request, `back-url-${request?.query?.src}`)
  return url ?? '/'
}

const getMainReturnPoint = (request) => {
  const url = getFromSession(request, mainReturnPoint)
  return url ?? '/'
}

const addBackNavigation = (request, markAsMainReturnPoint = false) => {
  if (markAsMainReturnPoint) {
    setInSession(request, mainReturnPoint, request.url.href)
  }

  const newHashParam = generateCurrentHashParam(request)
  const backLinkUrl = getPreviousUrl(request)

  setInSession(request, lastHashParam, newHashParam)

  return {
    backLink: backLinkUrl,
    srcHashParam: `${srcPrefix}${newHashParam}`,
    srcHashValue: newHashParam,
    currentHashParam: extractSrcParamFromUrl(request?.headers?.referer, true)
  }
}

const addBackNavigationForErrorCondition = (request) => {
  const srcParam = extractSrcParamFromReferer(request, true)
  let backLinkUrl
  if (srcParam === '') {
    backLinkUrl = getFromSession(request, lastReferer) ?? '/'
  } else {
    backLinkUrl = getFromSession(request, `${backUrl}${srcParam}`) ?? '/'
    if (backLinkUrl !== '/') {
      setInSession(request, lastReferer, backLinkUrl)
    }
  }

  return {
    backLink: backLinkUrl,
    srcHashParam: `${srcPrefix}${getFromSession(request, lastHashParam)}`,
    srcHashValue: getFromSession(request, lastHashParam),
    currentHashParam: extractSrcParamFromUrl(backLinkUrl)
  }
}

module.exports = {
  addBackNavigation,
  extractBackNavParam,
  addBackNavigationForErrorCondition,
  extractSrcParamFromUrl,
  getMainReturnPoint
}
