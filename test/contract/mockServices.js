const path = require('path')
const { Pact } = require('@pact-foundation/pact')

const consumerName = 'aphw-ddi-portal'
const indexApiProvider = 'aphw-ddi-api'
const eventsApiProvider = 'aphw-ddi-events'

const ddiIndexApiProvider = new Pact({
  consumer: consumerName,
  provider: indexApiProvider,
  port: 1234,
  log: path.resolve(process.cwd(), 'test-output', 'pact.log'),
  dir: path.resolve(process.cwd(), 'test-output')
})

const ddiEventsApiProvider = new Pact({
  consumer: consumerName,
  provider: eventsApiProvider,
  port: 1235,
  log: path.resolve(process.cwd(), 'test-output', 'pact.log'),
  dir: path.resolve(process.cwd(), 'test-output')
})

module.exports = {
  ddiIndexApiProvider,
  ddiEventsApiProvider
}
