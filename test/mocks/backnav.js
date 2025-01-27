const buildBackNav = (backNavPartial = {}) => ({
  backLink: '/',
  srcHashParam: '?src=src-hash-param',
  ...backNavPartial
})

module.exports = {
  buildBackNav
}
