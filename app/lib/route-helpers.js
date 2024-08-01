const throwIfPreConditionError = (request) => {
  for (const [key, value] of Object.entries(request.pre ?? {})) {
    if (value instanceof Error) {
      console.error(`Failed at pre step ${key}`, value)
      throw value
    }
  }
}

const getQueryString = request => {
  if (!request.query || !request.url?.href) {
    return ''
  }
  const pos = request.url.href.indexOf('?')
  return pos > -1 ? request.url.href.substr(pos) : ''
}

module.exports = {
  throwIfPreConditionError,
  getQueryString
}
