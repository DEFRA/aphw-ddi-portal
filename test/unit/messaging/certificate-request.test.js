jest.mock('ffc-messaging')
const { MessageSender } = require('ffc-messaging')

jest.mock('uuid')
const { v4: uuidv4 } = require('uuid')

const { sendMessage } = require('../../../app/messaging/outbound/certificate-request')

describe('certificate request message sender', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('should send message', async () => {
    uuidv4.mockReturnValue('1234')

    const cdo = {
      exemption: {
        exemptionOrder: 2015
      },
      person: {
        firstName: 'Joe',
        lastName: 'Bloggs',
        addresses: [
          {
            address: {
              address_line_1: '12 Test Street',
              address_line_2: '',
              town: 'Test City',
              postcode: 'TST 1AA'
            }
          }
        ]
      },
      dog: {
        indexNumber: 'ED1234',
        microchipNumber: '1234',
        name: 'Fido',
        breed: 'XL Bully',
        sex: 'Male',
        dateOfBirth: new Date('2020-01-01'),
        colour: 'White'
      }
    }

    await sendMessage(cdo)

    expect(MessageSender).toHaveBeenCalledTimes(1)
    expect(MessageSender.prototype.sendMessage).toHaveBeenCalledWith({
      body: {
        certificateId: '1234',
        exemptionOrder: 2015,
        owner: {
          name: 'Joe Bloggs',
          address: {
            line1: '12 Test Street',
            line2: '',
            line3: 'Test City',
            postcode: 'TST 1AA'
          }
        },
        dog: {
          indexNumber: 'ED1234',
          microchipNumber: '1234',
          name: 'Fido',
          breed: 'XL Bully',
          sex: 'Male',
          birthDate: new Date('2020-01-01'),
          colour: 'White'
        }
      },
      type: 'uk.gov.defra.aphw.ddi.certificate.requested',
      source: 'aphw-ddi-portal'
    })
    expect(MessageSender.prototype.closeConnection).toHaveBeenCalled()
  })

  test('should send message including organisation', async () => {
    uuidv4.mockReturnValue('1234')

    const cdo = {
      exemption: {
        exemptionOrder: 2015
      },
      person: {
        firstName: 'Joe',
        lastName: 'Bloggs',
        addresses: [
          {
            address: {
              address_line_1: '12 Test Street',
              address_line_2: '',
              town: 'Test City',
              postcode: 'TST 1AA'
            }
          }
        ],
        organisationName: 'Test org'
      },
      dog: {
        indexNumber: 'ED1234',
        microchipNumber: '1234',
        name: 'Fido',
        breed: 'XL Bully',
        sex: 'Male',
        dateOfBirth: new Date('2020-01-01'),
        colour: 'White'
      }
    }

    await sendMessage(cdo)

    expect(MessageSender).toHaveBeenCalledTimes(1)
    expect(MessageSender.prototype.sendMessage).toHaveBeenCalledWith({
      body: {
        certificateId: '1234',
        exemptionOrder: 2015,
        owner: {
          name: 'Joe Bloggs',
          address: {
            line1: '12 Test Street',
            line2: '',
            line3: 'Test City',
            postcode: 'TST 1AA'
          },
          organisationName: 'Test org'
        },
        dog: {
          indexNumber: 'ED1234',
          microchipNumber: '1234',
          name: 'Fido',
          breed: 'XL Bully',
          sex: 'Male',
          birthDate: new Date('2020-01-01'),
          colour: 'White'
        }
      },
      type: 'uk.gov.defra.aphw.ddi.certificate.requested',
      source: 'aphw-ddi-portal'
    })
    expect(MessageSender.prototype.closeConnection).toHaveBeenCalled()
  })
})
