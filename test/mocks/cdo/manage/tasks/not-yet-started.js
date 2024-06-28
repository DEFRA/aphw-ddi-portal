const notYetStartedTask = {
  available: true,
  completed: false,
  readonly: false
}

const notYetStartedTaskList = {
  tasks: {
    applicationPackSent: {
      key: 'applicationPackSent',
      available: true,
      completed: false,
      readonly: false
    },
    insuranceDetailsRecorded: {
      key: 'insuranceDetailsRecorded',
      available: false,
      completed: false,
      readonly: false
    },
    microchipNumberRecorded: {
      key: 'microchipNumberRecorded',
      available: false,
      completed: false,
      readonly: false
    },
    applicationFeePaid: {
      key: 'applicationFeePaid',
      available: false,
      completed: false,
      readonly: false
    },
    form2Sent: {
      key: 'form2Sent',
      available: false,
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
}

module.exports = {
  notYetStartedTask,
  notYetStartedTaskList
}
