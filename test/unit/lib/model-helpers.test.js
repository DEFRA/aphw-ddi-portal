const { addMonths } = require('date-fns')
const { canDogBeWithdrawn, getFolderName, extractEmail, cleanUserDisplayName, extractLatestPrimaryTelephoneNumber, extractLatestSecondaryTelephoneNumber, extractLatestAddress, extractLatestInsurance, setPoliceForce, dedupeAddresses, constructDateField, isMicrochipDeadlineVisibleInView, isNeuteringDeadlineVisibleInView, isMicrochipDeadlineVisibleInEditNearTop, isNeuteringDeadlineVisibleInEditNearTop, getNeuteringDeadlineHintText } = require('../../../app/lib/model-helpers')

jest.mock('../../../app/session/cdo/owner')
const { getEnforcementDetails, setEnforcementDetails, getOwnerDetails, getAddress } = require('../../../app/session/cdo/owner')

jest.mock('../../../app/api/police-area')
const { lookupPoliceForceByPostcode } = require('../../../app/api/police-area')

jest.mock('../../../app/api/ddi-index-api/police-forces')
const { getPoliceForceByApiCode } = require('../../../app/api/ddi-index-api/police-forces')

const { user } = require('../../mocks/auth')

describe('ModelHelpers', () => {
  beforeEach(async () => {
    getOwnerDetails.mockReturnValue()
  })

  test('extractEmail handles no emails', () => {
    const email = extractEmail(null)
    expect(email).toBe('')
  })

  test('extractEmail returns most recent email', () => {
    const contacts = [
      { contact: { id: 1, contact: 'not ane mail', contact_type_id: 1, contact_type: { contact_type: 'Phone' } } },
      { contact: { id: 2, contact: 'email1@here.com', contact_type_id: 2, contact_type: { contact_type: 'Email' } } },
      { contact: { id: 3, contact: 'email2@here.com', contact_type_id: 2, contact_type: { contact_type: 'Email' } } },
      { contact: { id: 4, contact: 'email3@here.com', contact_type_id: 2, contact_type: { contact_type: 'Email' } } },
      { contact: { id: 5, contact: 'not an email', contact_type_id: 1, contact_type: { contact_type: 'Phone' } } }
    ]

    const email = extractEmail(contacts)

    expect(email).toBe('email3@here.com')
  })

  test('extractEmail returns only email', () => {
    const contacts = [
      { contact: { id: 2, contact: 'email1@here.com', contact_type_id: 2, contact_type: { contact_type: 'Email' } } }
    ]

    const email = extractEmail(contacts)

    expect(email).toBe('email1@here.com')
  })

  test('extractEmail returns empty string if no emails', () => {
    const contacts = []

    const email = extractEmail(contacts)

    expect(email).toBe('')
  })

  test('extractLatestPrimaryTelephoneNumber returns latest primary phone number', () => {
    const contacts = [
      { contact: { id: 1, contact: 'phone1', contact_type_id: 1, contact_type: { contact_type: 'Phone' } } },
      { contact: { id: 2, contact: 'email1@here.com', contact_type_id: 2, contact_type: { contact_type: 'Email' } } },
      { contact: { id: 3, contact: 'email2@here.com', contact_type_id: 2, contact_type: { contact_type: 'Email' } } },
      { contact: { id: 4, contact: 'email3@here.com', contact_type_id: 2, contact_type: { contact_type: 'Email' } } },
      { contact: { id: 6, contact: 'phone3', contact_type_id: 1, contact_type: { contact_type: 'Phone' } } },
      { contact: { id: 5, contact: 'phone2', contact_type_id: 1, contact_type: { contact_type: 'Phone' } } },
      { contact: { id: 5, contact: 'phone4', contact_type_id: 3, contact_type: { contact_type: 'SecondaryPhone' } } }
    ]

    const phoneNumber = extractLatestPrimaryTelephoneNumber(contacts)

    expect(phoneNumber).toBe('phone3')
  })

  test('extractLatestPrimaryTelephoneNumber handles no contacts', () => {
    const phoneNumber = extractLatestPrimaryTelephoneNumber(null)
    expect(phoneNumber).toBe(null)
  })

  test('extractLatestPrimaryTelephoneNumber returns null if no primary phone numbers', () => {
    const contacts = [
      { contact: { id: 2, contact: 'email1@here.com', contact_type_id: 2, contact_type: { contact_type: 'Email' } } },
      { contact: { id: 3, contact: 'email2@here.com', contact_type_id: 2, contact_type: { contact_type: 'Email' } } },
      { contact: { id: 4, contact: 'email3@here.com', contact_type_id: 2, contact_type: { contact_type: 'Email' } } },
      { contact: { id: 5, contact: 'phone4', contact_type_id: 3, contact_type: { contact_type: 'SecondaryPhone' } } }
    ]

    const phoneNumber = extractLatestPrimaryTelephoneNumber(contacts)

    expect(phoneNumber).toBe(null)
  })

  test('extractLatestSecondaryTelephoneNumber returns latest secondary phone number', () => {
    const contacts = [
      { contact: { id: 1, contact: 'phone1', contact_type_id: 1, contact_type: { contact_type: 'Phone' } } },
      { contact: { id: 2, contact: 'email1@here.com', contact_type_id: 2, contact_type: { contact_type: 'Email' } } },
      { contact: { id: 3, contact: 'email2@here.com', contact_type_id: 2, contact_type: { contact_type: 'Email' } } },
      { contact: { id: 4, contact: 'email3@here.com', contact_type_id: 2, contact_type: { contact_type: 'Email' } } },
      { contact: { id: 6, contact: 'phone3', contact_type_id: 1, contact_type: { contact_type: 'Phone' } } },
      { contact: { id: 20, contact: 'phone4', contact_type_id: 3, contact_type: { contact_type: 'SecondaryPhone' } } },
      { contact: { id: 7, contact: 'phone5', contact_type_id: 3, contact_type: { contact_type: 'SecondaryPhone' } } },
      { contact: { id: 8, contact: 'phone6', contact_type_id: 3, contact_type: { contact_type: 'SecondaryPhone' } } }
    ]

    const phoneNumber = extractLatestSecondaryTelephoneNumber(contacts)

    expect(phoneNumber).toBe('phone4')
  })

  test('extractLatestSecondaryTelephoneNumber handles no contacts', () => {
    const phoneNumber = extractLatestSecondaryTelephoneNumber(null)
    expect(phoneNumber).toBe(null)
  })

  test('extractLatestSecondaryTelephoneNumber returns null if no secondary phone numbers', () => {
    const contacts = [
      { contact: { id: 1, contact: 'phone1', contact_type_id: 1, contact_type: { contact_type: 'Phone' } } },
      { contact: { id: 2, contact: 'email1@here.com', contact_type_id: 2, contact_type: { contact_type: 'Email' } } },
      { contact: { id: 3, contact: 'email2@here.com', contact_type_id: 2, contact_type: { contact_type: 'Email' } } },
      { contact: { id: 4, contact: 'email3@here.com', contact_type_id: 2, contact_type: { contact_type: 'Email' } } },
      { contact: { id: 6, contact: 'phone3', contact_type_id: 1, contact_type: { contact_type: 'Phone' } } }
    ]

    const phoneNumber = extractLatestSecondaryTelephoneNumber(contacts)

    expect(phoneNumber).toBe(null)
  })

  test('extractLatestAddress handles no addresses', () => {
    const address = extractLatestAddress(null)
    expect(address).toEqual({})
  })

  test('extractLatestInsurance handles no insurances', () => {
    const insurances = extractLatestInsurance(null)
    expect(insurances).toEqual({})
  })

  test('extractLatestInsurance returns latest insurance', () => {
    const insurances = [
      { id: 1, policy_number: 'VERY-OLD' },
      { id: 2, policy_number: 'LAST-YEAR' },
      { id: 3, policy_number: 'CURRENT' }
    ]

    const insurance = extractLatestInsurance(insurances)

    expect(insurance.policy_number).toBe('CURRENT')
  })

  test('setPoliceForce sets valid force when postcode from ownerDetails', async () => {
    lookupPoliceForceByPostcode.mockResolvedValue({ id: 5, name: 'Force 5' })
    getEnforcementDetails.mockReturnValue({ id: 123, legislationOfficer: 'dlo1' })
    getOwnerDetails.mockReturnValue({ address: { postcode: 'TS1 1TS' } })
    getAddress.mockReturnValue({ country: 'England' })

    await setPoliceForce({}, user)

    expect(setEnforcementDetails).toHaveBeenCalledWith(expect.anything(), { id: 123, policeForce: 5, legislationOfficer: 'dlo1' })
  })

  test('setPoliceForce sets scoland force when country is scotland', async () => {
    lookupPoliceForceByPostcode.mockResolvedValue({ id: 52, name: 'Police Scotland' })
    getPoliceForceByApiCode.mockResolvedValue({ id: 5, name: 'Force 5' })
    getEnforcementDetails.mockReturnValue({ id: 123, legislationOfficer: 'dlo1' })
    getOwnerDetails.mockReturnValue({ address: { postcode: 'TS1 1TS' } })
    getAddress.mockReturnValue({ country: 'Scotland' })

    await setPoliceForce({}, user)

    expect(setEnforcementDetails).toHaveBeenCalledWith(expect.anything(), { id: 123, policeForce: 5, legislationOfficer: 'dlo1' })
  })

  test('setPoliceForce sets valid force when postcode supplied', async () => {
    lookupPoliceForceByPostcode.mockResolvedValue({ id: 5, name: 'Force 5' })
    getEnforcementDetails.mockReturnValue({ id: 123, legislationOfficer: 'dlo1' })
    getOwnerDetails.mockReturnValue({ address: { postcode: 'TS1 1TS' } })
    getAddress.mockReturnValue({ country: 'England' })

    await setPoliceForce({}, user)

    expect(setEnforcementDetails).toHaveBeenCalledWith(expect.anything(), { id: 123, policeForce: 5, legislationOfficer: 'dlo1' })
  })

  test('setPoliceForce doesnt set force when lookup fails', async () => {
    lookupPoliceForceByPostcode.mockResolvedValue(null)
    getEnforcementDetails.mockReturnValue({ id: 123, legislationOfficer: 'dlo1' })
    getOwnerDetails.mockReturnValue({ address: { postcode: 'TS1 1TS' } })
    getAddress.mockReturnValue({ country: 'England' })

    await setPoliceForce({}, user)

    expect(setEnforcementDetails).not.toHaveBeenCalled()
  })

  test('dedupeAddresses handles no addresses', () => {
    const addresses = null
    const res = dedupeAddresses(addresses)
    expect(res).toEqual([])
  })

  test('dedupeAddresses handles unique addresses', () => {
    const addresses = [
      { text: 'address 1', value: 0 },
      { text: 'address 2', value: 1 },
      { text: 'address 3', value: 2 }
    ]
    const res = dedupeAddresses(addresses)
    expect(res).toEqual([
      { text: 'address 1', value: 0 },
      { text: 'address 2', value: 1 },
      { text: 'address 3', value: 2 }
    ])
  })

  test('dedupeAddresses handles duplicate addresses', () => {
    const addresses = [
      { text: 'address 1', value: 0 },
      { text: 'address 1', value: 1 },
      { text: 'address 1', value: 2 }
    ]
    const res = dedupeAddresses(addresses)
    expect(res).toEqual([
      { text: 'address 1', value: 2 }
    ])
  })

  test('dedupeAddresses handles duplicates and unique addresses', () => {
    const addresses = [
      { text: 'address 1', value: 0 },
      { text: 'address 1', value: 1 },
      { text: 'address 2', value: 2 },
      { text: 'address 3', value: 3 },
      { text: 'address 3', value: 4 },
      { text: 'address 3', value: 5 },
      { text: 'address 4', value: 6 },
      { text: 'address 4', value: 7 }
    ]
    const res = dedupeAddresses(addresses)
    expect(res).toEqual([
      { text: 'address 1', value: 1 },
      { text: 'address 2', value: 2 },
      { text: 'address 3', value: 5 },
      { text: 'address 4', value: 7 }
    ])
  })

  afterEach(async () => {
    jest.clearAllMocks()
  })

  describe('cleanUserDisplayName', () => {
    test('should clean up displayName given contains comma and no spaces', () => {
      expect(cleanUserDisplayName('Surname,Firstname')).toBe('Firstname Surname')
    })
    test('should clean up displayName given contains comma', () => {
      expect(cleanUserDisplayName('Surname, Firstname')).toBe('Firstname Surname')
    })

    test('should clean up displayName given contains comma and spaces', () => {
      expect(cleanUserDisplayName(' Surname , Firstname ')).toBe('Firstname Surname')
    })

    test('should not clean up displayName given no comma', () => {
      expect(cleanUserDisplayName('Firstname Surname')).toBe('Firstname Surname')
    })
  })

  describe('constructDateField', () => {
    test('should create date field', () => {
      const data = {
        'myId-day': '25',
        'myId-month': '12',
        'myId-year': '2024'
      }

      const res = constructDateField(data, 'myId', 'Field label text')

      expect(res).toEqual({
        type: 'date',
        id: 'myId',
        namePrefix: 'myId',
        fieldset: {
          legend: {
            text: 'Field label text',
            classes: 'govuk-fieldset__legend--s'
          }
        },
        items: [
          {
            name: 'day',
            classes: 'govuk-input--width-2',
            value: '25',
            attributes: { maxlength: '2' }
          },
          {
            name: 'month',
            classes: 'govuk-input--width-2',
            value: '12',
            attributes: { maxlength: '2' }
          },
          {
            name: 'year',
            classes: 'govuk-input--width-4',
            value: '2024',
            attributes: { maxlength: '4' }
          }
        ],
        classes: 'govuk-!-margin-bottom-5'
      })
    })

    test('should create date field with hint', () => {
      const data = {
        'myId2-day': '21',
        'myId2-month': '06',
        'myId2-year': '2024'
      }

      const res = constructDateField(data, 'myId2', 'Field label text2', 'hint text')

      expect(res).toEqual({
        type: 'date',
        id: 'myId2',
        namePrefix: 'myId2',
        fieldset: {
          legend: {
            text: 'Field label text2',
            classes: 'govuk-fieldset__legend--s'
          }
        },
        hint: {
          text: 'hint text'
        },
        items: [
          {
            name: 'day',
            classes: 'govuk-input--width-2',
            value: '21',
            attributes: { maxlength: '2' }
          },
          {
            name: 'month',
            classes: 'govuk-input--width-2',
            value: '06',
            attributes: { maxlength: '2' }
          },
          {
            name: 'year',
            classes: 'govuk-input--width-4',
            value: '2024',
            attributes: { maxlength: '4' }
          }
        ],
        classes: 'govuk-!-margin-bottom-5'
      })
    })
  })

  describe('isMicrochipDeadlineVisibleInView', () => {
    test('should return true for 2015', () => {
      const cdo = { exemption: { exemptionOrder: '2015' } }
      expect(isMicrochipDeadlineVisibleInView(cdo)).toBeTruthy()
    })
    test('should return true for 2023', () => {
      const cdo = { exemption: { exemptionOrder: '2023' } }
      expect(isMicrochipDeadlineVisibleInView(cdo)).toBeTruthy()
    })
    test('should return false for other', () => {
      const cdo = { exemption: { exemptionOrder: '1991' } }
      expect(isMicrochipDeadlineVisibleInView(cdo)).toBeFalsy()
    })
  })

  describe('isNeuteringDeadlineVisibleInView', () => {
    test('should return true for 2023', () => {
      const cdo = { exemption: { exemptionOrder: '2023' } }
      expect(isNeuteringDeadlineVisibleInView(cdo)).toBeTruthy()
    })
    test('should return true for 2015 if XLB', () => {
      const cdo = { exemption: { exemptionOrder: '2015' }, dog: { breed: 'XL Bully' } }
      expect(isNeuteringDeadlineVisibleInView(cdo)).toBeTruthy()
    })
    test('should return false for other', () => {
      const cdo = { exemption: { exemptionOrder: '1991' } }
      expect(isNeuteringDeadlineVisibleInView(cdo)).toBeFalsy()
    })
    test('should return false for 2015 but other breed', () => {
      const cdo = { exemption: { exemptionOrder: '2015' }, dog: { breed: 'Other' } }
      expect(isNeuteringDeadlineVisibleInView(cdo)).toBeFalsy()
    })
  })

  describe('isMicrochipDeadlineVisibleInEditNearTop', () => {
    test('should return true for 2015', () => {
      const exemption = { exemptionOrder: '2015' }
      expect(isMicrochipDeadlineVisibleInEditNearTop(exemption)).toBeTruthy()
    })
    test('should return false for other', () => {
      const exemption = { exemptionOrder: '2023' }
      expect(isMicrochipDeadlineVisibleInEditNearTop(exemption)).toBeFalsy()
    })
  })

  describe('isNeuteringDeadlineVisibleInEditNearTop', () => {
    test('should return true for 2015 and XLB', () => {
      const exemption = { exemptionOrder: '2015', dogBreed: 'XL Bully' }
      expect(isNeuteringDeadlineVisibleInEditNearTop(exemption)).toBeTruthy()
    })
    test('should return false for 2015 if not XLB', () => {
      const exemption = { exemptionOrder: '2015', dogBreed: 'Other' }
      expect(isNeuteringDeadlineVisibleInEditNearTop(exemption)).toBeFalsy()
    })
    test('should return false for other', () => {
      const exemption = { exemptionOrder: '2023', dogBreed: 'XL Bully' }
      expect(isNeuteringDeadlineVisibleInEditNearTop(exemption)).toBeFalsy()
    })
  })

  describe('getNeuteringDeadlineHintText', () => {
    test('should return shorter text for 2023', () => {
      const exemption = { exemptionOrder: '2023' }
      expect(getNeuteringDeadlineHintText(exemption)).toBe('The dog must be neutered by this date.')
    })
    test('should return longer text for non-2023', () => {
      const exemption = { exemptionOrder: '2015' }
      expect(getNeuteringDeadlineHintText(exemption)).toBe('The dog must be neutered by this date. The owner must provide evidence of neutering within 28 days.')
    })
  })

  describe('getFolderName', () => {
    test('should handle null', () => {
      expect(getFolderName(null)).toBe('')
    })
    test('should handle no folder', () => {
      expect(getFolderName('file1.pdf')).toBe('')
    })
    test('should get folder', () => {
      expect(getFolderName('folder2/file1.pdf')).toBe('folder2')
    })
    test('should get root folder if multiples', () => {
      expect(getFolderName('folder3/folder2/file1.pdf')).toBe('folder3')
    })
  })

  describe('canDogBeWithdrawn', () => {
    test('should handle no dob', () => {
      expect(canDogBeWithdrawn({ exemption: { exemptionOrder: '2023' }, dog: { dateOfBirth: null } })).toBeFalsy()
    })
    test('should handle younger than 18 months', () => {
      expect(canDogBeWithdrawn({ exemption: { exemptionOrder: '2023' }, dog: { dateOfBirth: addMonths(new Date(), -10) } })).toBeFalsy()
    })
    test('should handle older than 18 months', () => {
      expect(canDogBeWithdrawn({ exemption: { exemptionOrder: '2023' }, dog: { dateOfBirth: addMonths(new Date(), -20) } })).toBeTruthy()
    })
    test('should be false if not 2023', () => {
      expect(canDogBeWithdrawn({ exemption: { exemptionOrder: '2015' }, dog: { dateOfBirth: addMonths(new Date(), -20) } })).toBeFalsy()
    })
  })
})
