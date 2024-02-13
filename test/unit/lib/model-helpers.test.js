const { removePropertiesIfExist, extractEmail, extractLatestPrimaryTelephoneNumber, extractLatestSecondaryTelephoneNumber, extractLatestAddress, extractLatestInsurance } = require('../../../app/lib/model-helpers')

describe('ModelHelpers', () => {
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

  test('removeProperties removes properties that exist', () => {
    const model = {
      prop1: 'val1',
      prop2: 'val2',
      prop3: 'val3',
      prop4: 'val4',
      prop5: 'val5'
    }

    removePropertiesIfExist(model, ['prop2', 'prop4'])

    expect(model).toEqual({
      prop1: 'val1',
      prop3: 'val3',
      prop5: 'val5'
    })
  })

  test('removeProperties handles properties that do not exist', () => {
    const model = {
      prop1: 'val1',
      prop2: 'val2',
      prop3: 'val3',
      prop4: 'val4',
      prop5: 'val5'
    }

    removePropertiesIfExist(model, ['prop0', 'prop6'])

    expect(model).toEqual({
      prop1: 'val1',
      prop2: 'val2',
      prop3: 'val3',
      prop4: 'val4',
      prop5: 'val5'
    })
  })
})
