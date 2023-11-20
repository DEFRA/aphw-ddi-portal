const { odata } = require('@azure/data-tables')
const { tableClient } = require('./get-table-client')
const { UPLOADED } = require('../constants/import-status')

const maxDate = new Date(8640000000000000)

const invertTimestamp = (timestamp) => {
  const inverted = `${maxDate - timestamp}`

  return inverted.padStart(19, '0')
}

const createEntity = (filename, email, status) => {
  const now = new Date()

  return {
    PartitionKey: filename,
    RowKey: invertTimestamp(now),
    email,
    status,
    createdOn: now.toISOString(),
    updatedAt: now.toISOString()
  }
}

const addToTable = async (filename, email, status) => {
  await tableClient.createTable()

  const entity = createEntity(filename, email, status)

  await tableClient.createEntity(entity)
}

const queryImportsByPartition = async (filename, additionalOptions) => {
  await tableClient.createTable()

  const results = tableClient.listEntities({
    queryOptions: {
      ...additionalOptions,
      filter: odata`PartitionKey eq ${filename}`
    }
  })

  return results
}

const setUploaded = async (filename, email) => await addToTable(filename, email, UPLOADED)

const getLatestUpdate = async (filename) => {
  const results = await queryImportsByPartition(filename, { top: 1 })

  const { value: update } = await results[Symbol.asyncIterator]().next()

  return update
}

const getAllUpdates = async (filename) => {
  const results = await queryImportsByPartition(filename)

  const updates = []

  for await (const entity of results) {
    updates.push(entity)
  }

  return updates
}

module.exports = {
  setUploaded,
  getLatestUpdate,
  getAllUpdates
}
