const { string } = require('@pact-foundation/pact/dsl/matchers')

const validActivityRequest = {
  activity: 'Change of address form',
  activityType: 'sent',
  pk: 'P-123-456',
  source: 'owner',
  targetPk: 'P-123-456',
  activityDate: new Date(2024, 1, 1)
}

const validActivityResponseMatcher = {
  result: string('ok')
}

module.exports = {
  validActivityRequest,
  validActivityResponseMatcher
}
