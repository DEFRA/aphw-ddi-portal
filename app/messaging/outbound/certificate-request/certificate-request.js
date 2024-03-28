const { v4: uuidv4 } = require('uuid')
const { CERTIFICATE_REQUESTED } = require('../../../constants/events')

const createMessage = (data) => ({
  body: {
    certificateId: uuidv4(),
    exemptionOrder: data.exemption.exemptionOrder,
    owner: {
      name: `${data.person.firstName} ${data.person.lastName}`,
      address: {
        line1: data.person.addresses[0].address.address_line_1,
        line2: data.person.addresses[0].address.address_line_2,
        line3: data.person.addresses[0].address.town,
        postcode: data.person.addresses[0].address.postcode
      },
      organisationName: data.person.organisationName
    },
    dog: {
      indexNumber: data.dog.indexNumber,
      microchipNumber: data.dog.microchipNumber,
      name: data.dog.name,
      breed: data.dog.breed,
      sex: data.dog.sex,
      birthDate: data.dog.dateOfBirth,
      colour: data.dog.colour
    }
  },
  type: CERTIFICATE_REQUESTED,
  source: 'aphw-ddi-portal'
})

module.exports = {
  createMessage
}
