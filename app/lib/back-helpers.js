const { v4: uuidv4 } = require('uuid')
const { setInSession, getFromSession } = require('../session/session-wrapper')

const lastHashParam = 'last-hash-param'
const srcPrefix = '?src='
const backUrl = 'back-url-'
const lastReferer = 'last-referer'
const mainReturnPoint = 'main-return-point'

const forceToHttps = (url) => {
  if (url) {
    return url.startsWith('http://localhost') ? url : (url.startsWith('http://') ? `https://${url.substring(7)}` : url)
  }
  return url
}

const generateHashParamForCurrentScreen = (request) => {
  const id = uuidv4()
  const urlHashRef = id.split('-').shift().toLocaleLowerCase('en-GB').match(/.{1,4}/g).join('-')
  setInSession(request, `${backUrl}${urlHashRef}`, forceToHttps(request.url.href))

  return urlHashRef
}

const extractSrcParamFromUrl = (url, stripSrcPrefix) => {
  if (url && url.indexOf(srcPrefix) > -1) {
    const origSrc = url.substring(url.indexOf(srcPrefix))

    return stripSrcPrefix ? origSrc.substring(origSrc.indexOf(srcPrefix) + 5) : origSrc.substring(origSrc.indexOf(srcPrefix))
  }

  return ''
}

const extractSrcParamFromReferer = (request, removPrefix) => {
  return extractSrcParamFromUrl(forceToHttps(request?.headers?.referer), removPrefix)
}

const extractBackNavParam = (request, stripSrcPrefix) => {
  const callingSrcParam = extractSrcParamFromReferer(request, true)
  const prevUrl = callingSrcParam !== '' ? getFromSession(request, `${backUrl}${callingSrcParam}`) : getFromSession(request, lastReferer)

  return extractSrcParamFromUrl(prevUrl, stripSrcPrefix)
}

const getPreviousUrl = (request) => {
  const url = getFromSession(request, `back-url-${request?.query?.src}`)

  return url ?? '/'
}

const getMainReturnPoint = (request, pathOnly = true) => {
  const url = getFromSession(request, mainReturnPoint)
  return url ?? '/'
}

const addBackNavigation = (request, markAsMainReturnPoint = false) => {
  if (markAsMainReturnPoint) {
    setInSession(request, mainReturnPoint, forceToHttps(request.url.href))
  }

  const newHashParam = generateHashParamForCurrentScreen(request)
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

const getBackLinkToSamePage = (request) => {
  return request.headers?.referer ?? ''
}

module.exports = {
  addBackNavigation,
  extractBackNavParam,
  addBackNavigationForErrorCondition,
  getBackLinkToSamePage,
  extractSrcParamFromUrl,
  getMainReturnPoint,
  forceToHttps
}
