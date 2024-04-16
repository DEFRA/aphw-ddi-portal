/**
 * @type {import('@pact-foundation/pact').InteractionObject | import('@pact-foundation/pact').Interaction}
 */
const deleteDog = {
  state: 'aphw-ddi-api has a matching dog Bruno ED300006',
  uponReceiving: 'request to delete dog',
  withRequest: {
    method: 'DELETE',
    path: '/dog/ED300006',
    headers: {
      'ddi-username': 'test@example.com',
      'ddi-displayname': 'Example Tester'
    }
  },
  willRespondWith: {
    status: 204,
    headers: {
      'Content-Type': 'application/json; charset=utf-8'
    },
    body: ''
  }
}

module.exports = {
  deleteDog
}
