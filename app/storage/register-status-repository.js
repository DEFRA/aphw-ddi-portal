const { tableClient } = require('./get-table-client')

const maxDate = new Date(8640000000000000)

const invertTimestamp = () => {
  const date = new Date()
  const inverted = `${maxDate - date}`

  return inverted.padStart(19, '0')
}

const createEntity = (filename, email, status) => ({
  PartitionKey: filename,
  RowKey: invertTimestamp(),
  email,
  status,
  createdOn: new Date().toISOString(),
  updatedAt: new Date().toISOString()
})

const addToTable = async (filename, email, status) => {
  await tableClient.createTable()

  const entity = createEntity(filename, email, status)

  await tableClient.createEntity(entity)
}

const setUploaded = async (filename, email) => await addToTable(filename, email, 'uploaded')

module.exports = {
  setUploaded
}
