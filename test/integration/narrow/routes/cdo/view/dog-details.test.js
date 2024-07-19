const { auth, user, standardAuth } = require('../../../../../mocks/auth')
const { JSDOM } = require('jsdom')

describe('View dog details', () => {
  jest.mock('../../../../../../app/auth')
  const mockAuth = require('../../../../../../app/auth')

  jest.mock('../../../../../../app/api/ddi-index-api/cdo')
  const { getCdo } = require('../../../../../../app/api/ddi-index-api/cdo')

  const createServer = require('../../../../../../app/server')
  let server

  beforeEach(async () => {
    mockAuth.getUser.mockReturnValue(user)

    server = await createServer()
    await server.initialize()
  })

  describe('GET /cdo/view/dog-details returns 200', () => {
    const baseCdo = {
      dog: {
        id: 1,
        indexNumber: 'ED123',
        name: 'Bruno',
        status: { status: 'TEST' },
        dog_breed: { breed: 'breed1' }
      },
      person: {
        firstName: 'John Smith',
        addresses: [{
          address: {}
        }],
        person_contacts: []
      },
      exemption: {
        exemptionOrder: 2015,
        insurance: [{
          company: 'Dogs Trust'
        }]
      }
    }
    beforeEach(() => {
      getCdo.mockResolvedValue(baseCdo)
    })

    test('GET /cdo/view/dog-details route returns 200 given standard', async () => {
      const options = {
        method: 'GET',
        url: '/cdo/view/dog-details/ED123',
        auth: standardAuth
      }

      const response = await server.inject(options)

      const { document } = new JSDOM(response.payload).window

      expect(response.statusCode).toBe(200)
      expect(document.querySelector('h1').textContent.trim()).toBe('Dog ED123')
      expect(document.querySelectorAll('.govuk-summary-list__value')[0].textContent.trim()).toBe('Bruno')
      expect(document.querySelectorAll('.govuk-summary-card:nth-child(2) .govuk-summary-list__value')[0].textContent.trim()).toBe('John Smith')
      expect(document.querySelectorAll('.govuk-summary-card')[2].querySelectorAll('.govuk-summary-list__value')[6].textContent.trim()).toBe('Dogs Trust')
      expect(document.querySelectorAll('.govuk-grid-column-one-half .govuk-button')[0].textContent.trim()).toBe('Add an activity')
      expect(document.querySelectorAll('.govuk-grid-column-one-half .govuk-button')[1].textContent.trim()).toBe('Check activity')
      expect(document.querySelector('.govuk-button[data-testid="delete-dog-record-btn"]')).toBeNull()
      expect(document.querySelectorAll('.govuk-summary-card')[2].querySelectorAll('.govuk-summary-list__actions')[1]).toBe(undefined)
    })

    test('GET /cdo/view/dog-details route returns 200 and allows gen cert if Exempt and cert issued date', async () => {
      getCdo.mockResolvedValue({
        dog: {
          id: 1,
          indexNumber: 'ED123',
          name: 'Bruno',
          status: 'Exempt',
          dog_breed: { breed: 'breed1' }
        },
        person: {
          firstName: 'John Smith',
          addresses: [{
            address: {}
          }],
          person_contacts: []
        },
        exemption: {
          exemptionOrder: 2015,
          certificateIssued: '2024-01-01',
          insurance: [{
            company: 'Dogs Trust'
          }]
        }
      })

      const options = {
        method: 'GET',
        url: '/cdo/view/dog-details/ED123',
        auth: standardAuth
      }

      const response = await server.inject(options)

      const { document } = new JSDOM(response.payload).window

      expect(response.statusCode).toBe(200)
      expect(document.querySelector('h1').textContent.trim()).toBe('Dog ED123')
      expect(document.querySelectorAll('.govuk-summary-list__value')[0].textContent.trim()).toBe('Bruno')
      expect(document.querySelectorAll('.govuk-summary-card:nth-child(2) .govuk-summary-list__value')[0].textContent.trim()).toBe('John Smith')
      expect(document.querySelectorAll('.govuk-summary-card')[2].querySelectorAll('.govuk-summary-list__value')[6].textContent.trim()).toBe('Dogs Trust')
      expect(document.querySelectorAll('.govuk-grid-column-one-half .govuk-button')[0].textContent.trim()).toBe('Add an activity')
      expect(document.querySelectorAll('.govuk-grid-column-one-half .govuk-button')[1].textContent.trim()).toBe('Check activity')
      expect(document.querySelector('.govuk-button[data-testid="delete-dog-record-btn"]')).toBeNull()
      const exemptionKeyRows = document.querySelectorAll('.govuk-summary-card')[2].querySelectorAll('.govuk-summary-list__key')
      const exemptionValueRows = document.querySelectorAll('.govuk-summary-card')[2].querySelectorAll('.govuk-summary-list__value')
      const exemptionActionRows = document.querySelectorAll('.govuk-summary-card')[2].querySelectorAll('.govuk-summary-list__actions')
      expect(exemptionKeyRows[0].textContent.trim()).toBe('Status')
      expect(exemptionKeyRows[1].textContent.trim()).toBe('First certificate issued')
      expect(exemptionValueRows[0].textContent.trim()).toBe('Exempt')
      expect(exemptionValueRows[1].textContent.trim()).toBe('01 January 2024')
      expect(exemptionActionRows[0].textContent.trim()).toBe('Change status (Exemption details)')
      expect(exemptionActionRows[1].textContent.trim()).toBe('Generate certificate')
    })

    test('GET /cdo/view/dog-details route returns 200 with Not entered values given fields missing', async () => {
      getCdo.mockResolvedValue({
        person: {
          id: 183,
          personReference: 'P-4813-BF4F',
          firstName: 'Wreck it',
          lastName: 'Ralph',
          dateOfBirth: null,
          addresses: [{
            id: 197,
            person_id: 183,
            address_id: 197,
            created_at: '2024-05-08T07:25:58.625Z',
            deleted_at: null,
            updated_at: '2024-05-08T07:25:58.668Z',
            address: {
              id: 197,
              address_line_1: '47 PARK STREET',
              address_line_2: null,
              town: 'LONDON',
              postcode: 'W1K 7EB',
              county: null,
              country_id: 1,
              created_at: '2024-05-08T07:25:58.625Z',
              deleted_at: null,
              updated_at: '2024-05-08T07:25:58.657Z',
              country: { id: 1, country: 'England' }
            }
          }],
          person_contacts: [],
          organisationName: null
        },
        dog: {
          id: 300242,
          dogReference: '7f241e8f-1960-4375-92ff-cb40b172e4be',
          indexNumber: 'ED300242',
          name: '',
          breed: 'Pit Bull Terrier',
          status: 'Pre-exempt',
          dateOfBirth: null,
          dateOfDeath: null,
          tattoo: null,
          colour: null,
          sex: null,
          dateExported: null,
          dateStolen: null,
          dateUntraceable: null,
          microchipNumber: null,
          microchipNumber2: null
        },
        exemption: {
          exemptionOrder: '2015',
          cdoIssued: '2024-01-01',
          cdoExpiry: null,
          policeForce: null,
          legislationOfficer: '',
          certificateIssued: null,
          applicationFeePaid: null,
          insurance: [],
          neuteringConfirmation: null,
          microchipVerification: null,
          joinedExemptionScheme: null,
          nonComplianceLetterSent: null
        }
      })

      const options = {
        method: 'GET',
        url: '/cdo/view/dog-details/ED123?force=true',
        auth
      }

      const response = await server.inject(options)

      const { document } = new JSDOM(response.payload).window

      expect(response.statusCode).toBe(200)
      const notEntered = 'Not entered'
      const [dogDetails, ownerDetails, exemptionDetails] = document.querySelectorAll('.govuk-summary-card__content')

      const [
        dogNameKey, dogNameValue,
        breedKey, breedValue,
        colourKey, colourValue,
        sexKey, sexValue,
        dogDOBKey, dogDOBValue,
        microchipNumberKey, microchipNumberValue
      ] = dogDetails.querySelectorAll('.govuk-summary-list__row > *')

      expect(dogNameKey.textContent.trim()).toBe('Name')
      expect(dogNameValue.textContent.trim()).toBe(notEntered)
      expect(breedKey.textContent.trim()).toBe('Breed type')
      expect(breedValue.textContent.trim()).toBe('Pit Bull Terrier')
      expect(colourKey.textContent.trim()).toBe('Colour')
      expect(colourValue.textContent.trim()).toBe(notEntered)
      expect(sexKey.textContent.trim()).toBe('Sex')
      expect(sexValue.textContent.trim()).toBe(notEntered)
      expect(dogDOBKey.textContent.trim()).toBe('Date of birth')
      expect(dogDOBValue.textContent.trim()).toBe(notEntered)
      expect(microchipNumberKey.textContent.trim()).toBe('Microchip number')
      expect(microchipNumberValue.textContent.trim()).toBe(notEntered)

      const [
        nameKey,
        dateOfBirthKey,
        addressKey,
        emailKey,
        telephoneNumberKey,
        countryKey
      ] = ownerDetails.querySelectorAll('.govuk-summary-list__key')
      const [
        nameValue,
        dateOfBirthValue, ,
        emailValue,
        telephoneNumberValue
      ] = ownerDetails.querySelectorAll('.govuk-summary-list__value')

      expect(nameKey.textContent.trim()).toBe('Name')
      expect(dateOfBirthKey.textContent.trim()).toBe('Date of birth')
      expect(addressKey.textContent.trim()).toBe('Address')
      expect(emailKey.textContent.trim()).toBe('Email')
      expect(telephoneNumberKey.textContent.trim()).toBe('Telephone number 1')
      expect(countryKey.textContent.trim()).toBe('Country')
      expect(nameValue.textContent.trim()).toBe('Wreck it Ralph')
      expect(dateOfBirthValue.textContent.trim()).toBe(notEntered)
      expect(emailValue.textContent.trim()).toBe(notEntered)
      expect(telephoneNumberValue.textContent.trim()).toBe(notEntered)

      const [,
        firstCertificateIssuedKey, ,
        cdoExpiryKey,
        courtKey,
        policeForceKey,
        applicationFeePaidKey,
        insuranceCompanyKey,
        insuranceRenewalKey,
        neuteringConfirmationKey,
        microchipNumberVerifiedKey
      ] = exemptionDetails.querySelectorAll('.govuk-summary-list__key')
      const [,
        firstCertificateIssuedValue, ,
        cdoExpiryValue,
        courtValue,
        policeForceValue,
        applicationFeePaidValue,
        insuranceCompanyValue,
        insuranceRenewalValue,
        neuteringConfirmationValue,
        microchipNumberVerifiedValue
      ] = exemptionDetails.querySelectorAll('.govuk-summary-list__value')
      const [, firstCertificateIssued] = exemptionDetails.querySelectorAll('.govuk-summary-list__actions')

      expect(firstCertificateIssuedKey.textContent.trim()).toBe('First certificate issued')
      expect(cdoExpiryKey.textContent.trim()).toBe('CDO expiry')
      expect(courtKey.textContent.trim()).toBe('Court')
      expect(policeForceKey.textContent.trim()).toBe('Police force')
      expect(applicationFeePaidKey.textContent.trim()).toBe('Application fee paid')
      expect(insuranceCompanyKey.textContent.trim()).toBe('Insurance company')
      expect(insuranceRenewalKey.textContent.trim()).toBe('Insurance renewal date')
      expect(neuteringConfirmationKey.textContent.trim()).toBe('Neutering confirmed')
      expect(microchipNumberVerifiedKey.textContent.trim()).toBe('Microchip number verified')
      expect(firstCertificateIssuedValue.textContent.trim()).toBe(notEntered)
      expect(cdoExpiryValue.textContent.trim()).toBe(notEntered)
      expect(courtValue.textContent.trim()).toBe(notEntered)
      expect(policeForceValue.textContent.trim()).toBe(notEntered)
      expect(applicationFeePaidValue.textContent.trim()).toBe(notEntered)
      expect(insuranceCompanyValue.textContent.trim()).toBe(notEntered)
      expect(insuranceRenewalValue.textContent.trim()).toBe(notEntered)
      expect(neuteringConfirmationValue.textContent.trim()).toBe(notEntered)
      expect(microchipNumberVerifiedValue.textContent.trim()).toBe(notEntered)
      expect(firstCertificateIssued).toBeUndefined()
    })

    test('GET /cdo/view/dog-details route to 2023 order returns 200 with Not entered values given fields missing', async () => {
      getCdo.mockResolvedValue({
        person: {
          id: 184,
          personReference: 'P-FB18-9016',
          firstName: 'Super',
          lastName: 'Mario',
          dateOfBirth: null,
          addresses: [{
            id: 199,
            person_id: 184,
            address_id: 199,
            created_at: '2024-05-08T12:52:07.553Z',
            deleted_at: null,
            updated_at: '2024-05-08T12:52:07.567Z',
            address: {
              id: 199,
              address_line_1: '17 SUSSEX COURT, SPRING STREET',
              address_line_2: null,
              town: 'LONDON',
              postcode: 'W2 1JF',
              county: null,
              country_id: 1,
              created_at: '2024-05-08T12:52:07.553Z',
              deleted_at: null,
              updated_at: '2024-05-08T12:52:07.563Z',
              country: { id: 1, country: 'England' }
            }
          }],
          person_contacts: [],
          organisationName: null
        },
        dog: {
          id: 300243,
          dogReference: '49864370-16ea-4d5b-92c6-79f360eff00c',
          indexNumber: 'ED300243',
          name: '',
          breed: 'XL Bully',
          status: 'Interim exempt',
          dateOfBirth: null,
          dateOfDeath: null,
          tattoo: null,
          colour: null,
          sex: null,
          dateExported: null,
          dateStolen: null,
          dateUntraceable: null,
          microchipNumber: null,
          microchipNumber2: null
        },
        exemption: {
          exemptionOrder: '2023',
          cdoIssued: null,
          cdoExpiry: null,
          policeForce: 'Metropolitan Police Service',
          legislationOfficer: '',
          certificateIssued: null,
          applicationFeePaid: null,
          insurance: [],
          neuteringConfirmation: null,
          microchipVerification: null,
          joinedExemptionScheme: '2024-05-08',
          nonComplianceLetterSent: null
        }
      })

      const options = {
        method: 'GET',
        url: '/cdo/view/dog-details/ED123',
        auth
      }

      const response = await server.inject(options)

      const { document } = new JSDOM(response.payload).window

      expect(response.statusCode).toBe(200)
      const [,, exemptionDetails] = document.querySelectorAll('.govuk-summary-card__content')

      const [,
        firstCertificateIssuedKey,
        orderKey,
        policeForceKey
      ] = exemptionDetails.querySelectorAll('.govuk-summary-list__key')

      expect(firstCertificateIssuedKey.textContent.trim()).toBe('First certificate issued')
      expect(orderKey.textContent.trim()).toBe('Order')
      expect(policeForceKey.textContent.trim()).toBe('Police force')
    })

    test('GET /cdo/view/dog-details route returns 200 given admin user', async () => {
      const options = {
        method: 'GET',
        url: '/cdo/view/dog-details/ED123',
        auth
      }

      const response = await server.inject(options)

      const { document } = new JSDOM(response.payload).window

      expect(response.statusCode).toBe(200)
      expect(document.querySelector('.govuk-button[data-testid="delete-dog-record-btn"]').textContent.trim()).toBe('Delete dog record')
      expect(document.querySelector('.govuk-button[data-testid="delete-dog-record-btn"]').getAttribute('href')).toContain('/cdo/delete/dog/ED123?src=')
    })

    test('GET /cdo/view/dog-details route returns 200 and In breach reasons given In breach', async () => {
      getCdo.mockResolvedValue({
        ...baseCdo,
        dog: {
          ...baseCdo.dog,
          status: 'In breach',
          breaches: [
            'dog not covered by third party insurance',
            'dog not kept on lead or muzzled',
            'dog kept in insecure place'
          ]
        }
      })

      const options = {
        method: 'GET',
        url: '/cdo/view/dog-details/ED123',
        auth: standardAuth
      }

      const response = await server.inject(options)

      const { document } = new JSDOM(response.payload).window

      expect(response.statusCode).toBe(200)
      const [,, exemptionDetails] = document.querySelectorAll('.govuk-summary-card')
      const [inBreach] = exemptionDetails.querySelectorAll('.govuk-summary-list__value')
      expect(inBreach.textContent.trim()).toContain('In breach:')
      const [first, second, third] = inBreach.querySelectorAll('li')
      expect(first.textContent.trim()).toEqual('dog not covered by third party insurance')
      expect(second.textContent.trim()).toEqual('dog not kept on lead or muzzled')
      expect(third.textContent.trim()).toEqual('dog kept in insecure place')
    })
  })

  test('GET /cdo/view/dog-details route returns 404 if no data found', async () => {
    getCdo.mockResolvedValue(undefined)

    const options = {
      method: 'GET',
      url: '/cdo/view/dog-details/ED123',
      auth
    }

    const response = await server.inject(options)

    expect(response.statusCode).toBe(404)
  })

  test('GET /cdo/view/dog-details route redirects to Manage CDO when no force param and dog Pre-exempt', async () => {
    getCdo.mockResolvedValue({
      dog: {
        id: 300243,
        indexNumber: 'ED300243',
        status: 'Pre-exempt'
      }
    })

    const options = {
      method: 'GET',
      url: '/cdo/view/dog-details/ED300243?src=abc123',
      auth
    }

    const response = await server.inject(options)

    expect(response.statusCode).toBe(302)
    expect(response.headers.location).toBe('/cdo/manage/cdo/ED300243?src=abc123')
  })

  afterEach(async () => {
    jest.clearAllMocks()
    await server.stop()
  })
})
