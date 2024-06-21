const { get, post } = require('./base')
const createCdoSchema = require('../../schema/ddi-index-api/cdo/create')

const cdoEndpoint = 'cdo'

const options = {
  json: true
}

const getCdo = async (indexNumber) => {
  const payload = await get(`${cdoEndpoint}/${indexNumber}`, options)
  return payload.cdo
}

const createCdo = async (cdo, user) => {
  const { value, error } = createCdoSchema.validate(cdo)

  if (error) {
    throw error
  }

  const res = await post(cdoEndpoint, value, user)

  return res
}

const getManageCdoDetails = async (indexNumber) => {
  return {
    tasks: {
      applicationPackSent: {
        key: 'applicationPackSent',
        available: true,
        completed: false,
        editable: true,
        timestamp: undefined
      },
      insuranceDetailsRecorded: {
        key: 'insuranceDetailsRecorded',
        available: false,
        completed: false,
        editable: true,
        timestamp: undefined
      },
      microchipNumberRecorded: {
        key: 'microchipNumberRecorded',
        available: false,
        completed: false,
        editable: true,
        timestamp: undefined
      },
      applicationFeePaid: {
        key: 'applicationFeePaid',
        available: false,
        completed: false,
        editable: true,
        timestamp: undefined
      },
      form2Sent: {
        key: 'form2Sent',
        available: false,
        completed: false,
        editable: true,
        timestamp: undefined
      },
      verificationDateRecorded: {
        key: 'verificationDateRecorded',
        available: false,
        completed: false,
        editable: true,
        timestamp: undefined
      },
      certificateIssued: {
        key: 'certificateIssued',
        available: false,
        completed: false,
        editable: true,
        timestamp: undefined
      }
    }
  }
  // const payload = await get(`${cdoEndpoint}/${indexNumber}/manage`, options)
  // return payload
}

module.exports = {
  createCdo,
  getCdo,
  getManageCdoDetails
}
