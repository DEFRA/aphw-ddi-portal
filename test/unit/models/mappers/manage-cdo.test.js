const { mapManageCdoDetails } = require('../../../../app/models/mappers/manage-cdo')
const { buildTaskListFromInitial } = require('../../../mocks/cdo/manage/tasks/builder')

const details = buildTaskListFromInitial({
  tasks: {
    applicationPackSent: {
      key: 'applicationPackSent',
      available: true,
      completed: true,
      readonly: true,
      timestamp: '2024-08-06T00:00:00.000Z'
    },
    insuranceDetailsRecorded: {
      key: 'insuranceDetailsRecorded',
      available: true,
      completed: false,
      readonly: false
    },
    microchipNumberRecorded: {
      key: 'microchipNumberRecorded',
      available: true,
      completed: false,
      readonly: false
    },
    applicationFeePaid: {
      key: 'applicationFeePaid',
      available: true,
      completed: false,
      readonly: false
    },
    form2Sent: {
      key: 'form2Sent',
      available: true,
      completed: false,
      readonly: false
    },
    verificationDateRecorded: {
      key: 'verificationDateRecorded',
      available: false,
      completed: false,
      readonly: false
    },
    certificateIssued: {
      key: 'certificateIssued',
      available: false,
      completed: false,
      readonly: false
    }
  }
})

const cdo = {
  person: {
    personReference: 'P-1234-5678'
  },
  dog: {
    indexNumber: 'ED12345'
  },
  exemption: {
    cdoExpiry: '2024-06-05'
  }
}

describe('Manage CDO Mapper', () => {
  test('should handle a completed task', () => {
    const res = mapManageCdoDetails(details, cdo)
    const sendApplicationPack = res.taskList.filter(task => task.key === 'send-application-pack')[0]
    expect(sendApplicationPack.status).toBe('Completed')
    expect(sendApplicationPack.completedDate).toBe('06 Aug 2024')
    const insuranceDetailsRecorded = res.taskList.filter(task => task.key === 'record-insurance-details')[0]
    expect(insuranceDetailsRecorded.status).toBe('Not yet started')
  })
})
