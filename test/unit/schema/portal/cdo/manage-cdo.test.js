const { microchipVerification, neuteringConfirmation, verificationDatesSchema } = require('../../../../../app/schema/portal/cdo/tasks/record-verification-dates')
const { sendApplicationPackPayloadSchema } = require('../../../../../app/schema/portal/cdo/tasks/send-application-pack')
const { ValidationError } = require('joi')
describe('manage-cdo single cdo', () => {
  describe('sendApplicationPack', () => {
    test('should not validate if email is invalid', () => {
      const sendApplicationPackPayload = {
        taskName: 'send-application-pack',
        contact: 'email',
        email: 'garrymcfadyen.hotmail.com'
      }
      const { error } = sendApplicationPackPayloadSchema.validate(sendApplicationPackPayload)
      expect(error).toEqual(new ValidationError('Enter an email address in the correct format, like name@example.com'))
    })

    test('should not validate if email is empty', () => {
      const sendApplicationPackPayload = {
        taskName: 'send-application-pack',
        contact: 'email',
        email: ''
      }
      const { error } = sendApplicationPackPayloadSchema.validate(sendApplicationPackPayload)
      expect(error).toEqual(new ValidationError('Enter an email address'))
    })
  })
  describe('microchipVerification', () => {
    test('should have correct error message', () => {
      const microchipVerificationObject = {}
      const { error } = microchipVerification.validate(microchipVerificationObject)
      expect(error).toEqual(new ValidationError('Enter the date the dog’s microchip number was verified'))
    })
  })

  describe('neuteringConfirmation', () => {
    test('should have correct error message', () => {
      const neuteringConfirmationPayload = {}
      const { error } = neuteringConfirmation.validate(neuteringConfirmationPayload)
      expect(error).toEqual(new ValidationError('Enter the date the dog’s neutering was verified'))
    })
  })

  describe('verificationDatesSchema', () => {
    test('should show correct error message if there is a duplicate microchipVerification', () => {
      const verificationDatesPayload = {
        taskName: 'test',
        dogNotFitForMicrochip: true,
        microchipVerification: { year: '2012', month: '12', day: '01' },
        neuteringConfirmation: { year: '2012', month: '12', day: '01' }
      }
      const { error } = verificationDatesSchema.validate(verificationDatesPayload)
      expect(error).toEqual(new ValidationError('Enter the date the dog’s microchip number was verified, or select ‘Dog declared unfit for microchipping by vet’'))
    })

    test('should show correct error message if there is a duplicate microchipVerification', () => {
      const verificationDatesPayload = {
        taskName: 'test',
        dogNotNeutered: true,
        microchipVerification: { year: '2012', month: '12', day: '01' },
        neuteringConfirmation: { year: '2012', month: '12', day: '01' }
      }
      const { error } = verificationDatesSchema.validate(verificationDatesPayload)
      expect(error).toEqual(new ValidationError('Enter the date the dog’s neutering was verified, or select ‘Dog aged under 16 months and not neutered’'))
    })
  })
})
