/**
 * @type {import('@pact-foundation/pact').InteractionObject | import('@pact-foundation/pact').Interaction}
 */
const deleteDog = {
  state: 'aphw-ddi-api has a matching dog Bruno ED300000',
  uponReceiving: 'request to delete dog',
  withRequest: {
    method: 'DELETE',
    path: '/dog/ED300000',
    headers: {
      'ddi-username': 'test@example.com',
      'ddi-displayname': 'Example Tester'
    }
  },
  willRespondWith: {
    status: 204,
    body: ''
  }
}

module.exports = {
  deleteDog
}
