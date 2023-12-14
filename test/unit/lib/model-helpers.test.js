const { extractEmail, extractTelephoneNumbers, extractLatestAddress, extractLatestInsurance } = require('../../../app/lib/model-helpers')

describe('ModelHelpers', () => {
  test('extractEmail handles no emails', () => {
    const email = extractEmail(null)
    expect(email).toBe('')
  })

  test('extractEmail returns most recent email', () => {
    const contacts = [
      { contact: { id: 1, contact: 'not ane mail', contact_type_i: 1 } },
      { contact: { id: 2, contact: 'email1@here.com', contact_type_i: 2 } },
      { contact: { id: 3, contact: 'email2@here.com', contact_type_i: 2 } },
      { contact: { id: 4, contact: 'email3@here.com', contact_type_i: 2 } },
      { contact: { id: 5, contact: 'not an email', contact_type_i: 1 } }
    ]

    const email = extractEmail(contacts)

    expect(email).toBe('email3@here.com')
  })

  test('extractEmail returns only email', () => {
    const contacts = [
      { contact: { id: 2, contact: 'email1@here.com', contact_type_i: 2 } }
    ]

    const email = extractEmail(contacts)

    expect(email).toBe('email1@here.com')
  })

  test('extractTelephoneNumbers returns all phone numbers in order of id', () => {
    const contacts = [
      { contact: { id: 1, contact: 'phone1', contact_type_i: 1 } },
      { contact: { id: 2, contact: 'email1@here.com', contact_type_i: 2 } },
      { contact: { id: 3, contact: 'email2@here.com', contact_type_i: 2 } },
      { contact: { id: 4, contact: 'email3@here.com', contact_type_i: 2 } },
      { contact: { id: 6, contact: 'phone3', contact_type_i: 1 } },
      { contact: { id: 5, contact: 'phone2', contact_type_i: 1 } }
    ]

    const phoneNumbers = extractTelephoneNumbers(contacts)

    expect(phoneNumbers.length).toBe(3)
    expect(phoneNumbers[0]).toBe('phone1')
    expect(phoneNumbers[1]).toBe('phone2')
    expect(phoneNumbers[2]).toBe('phone3')
  })

  test('extractTelephoneNumbers handles no contacts', () => {
    const phoneNumbers = extractTelephoneNumbers(null)
    expect(phoneNumbers).toEqual([])
  })

  test('extractLatestAddress handles no addresses', () => {
    const phoneNumbers = extractLatestAddress(null)
    expect(phoneNumbers).toEqual([])
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
})
