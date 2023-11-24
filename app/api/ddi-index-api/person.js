const { post } = require('./base')
const schema = require('../../schema/ddi-index-api/people')

const personEndpoint = 'person'

const addPerson = async person => {
  const data = {
    people: [
      person
    ]
  }

  const { error } = schema.validate(data)

  if (error) {
    throw new Error(error)
  }

  const payload = await post(personEndpoint, data)

  return payload.references[0]
}

module.exports = {
  addPerson
}
