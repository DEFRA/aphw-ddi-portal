const { Matchers } = require('@pact-foundation/pact')
const anyIntegerString = (generate) => Matchers.term({ generate, matcher: '^([1-9][0-9]*)$' })

module.exports = {
  anyIntegerString
}
