const { formatToGds } = require('../../lib/date-helpers')

const getStatus = task => {
  if (!task?.available) {
    return 'Cannot start yet'
  }

  return task.completed ? 'Completed' : 'Not yet started'
}

const mapManageCdoDetails = (details, cdo) => {
  details.tasks.applicationPackSent.status = getStatus(details.tasks.applicationPackSent)
  details.tasks.insuranceDetailsRecorded.status = getStatus(details.tasks.insuranceDetailsRecorded)
  details.tasks.microchipNumberRecorded.status = getStatus(details.tasks.microchipNumberRecorded)
  details.tasks.applicationFeePaid.status = getStatus(details.tasks.applicationFeePaid)
  details.tasks.form2Sent.status = getStatus(details.tasks.form2Sent)
  details.tasks.verificationDateRecorded.status = getStatus(details.tasks.verificationDateRecorded)
  details.tasks.certificateIssued.status = getStatus(details.tasks.certificateIssued)
  details.dogIndex = cdo.dog.indexNumber
  details.personReference = cdo.person.personReference
  details.cdoExpiry = formatToGds(cdo.exemption.cdoExpiry)
  return details
}

module.exports = {
  mapManageCdoDetails
}
