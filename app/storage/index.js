const { getTableClient } = require('./table')

const maxDate = new Date(8640000000000000)

const addRegisterImport = async (filename, email) => {
  const tableClient = getTableClient()

  const createdOn = new Date()
  const invertedDate = `${maxDate - Date.now()}`

  return tableClient.createEntity({
    PartitionKey: filename,
    RowKey: invertedDate,
    email,
    createdOn,
    updatedAt: createdOn,
    status: 'uploaded'
  })
}

module.exports = {
  addRegisterImport
}
