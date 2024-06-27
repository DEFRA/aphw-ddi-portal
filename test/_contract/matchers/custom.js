const { term } = require('@pact-foundation/pact/dsl/matchers')
const anyIntegerString = (generate) => term({ generate, matcher: '^([1-9][0-9]*)$' })

module.exports = {
  anyIntegerString
}
