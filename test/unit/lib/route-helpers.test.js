jest.mock('../../../app/lib/back-helpers')
const { addBackNavigation } = require('../../../app/lib/back-helpers')

jest.mock('../../../app/session/session-wrapper')
const { setInSession } = require('../../../app/session/session-wrapper')

jest.mock('../../../app/session/cdo/owner')
const { setPostcodeLookupDetails } = require('../../../app/session/cdo/owner')

const { throwIfPreConditionError, determineNextScreenAfterAddressChange } = require('../../../app/lib/route-helpers')
describe('throwIfPreConditionError', () => {
  test('should throw an error if any of the pre conditions throw an error', () => {
    const request = {
      pre: {
        step1: new Error('some error')
      }
    }
    expect(() => throwIfPreConditionError(request)).toThrow('some error')
  })

  test('should not throw an error if the pre conditions pass', () => {
    const request = {
      pre: {
        step1: 'success'
      }
    }
    expect(() => throwIfPreConditionError(request)).not.toThrow()
  })

  test('should not throw an error if no pre exists', () => {
    const request = {}
    expect(() => throwIfPreConditionError(request)).not.toThrow()
  })
})

describe('determineNextScreenAfterAddressChange', () => {
  beforeEach(async () => {
    jest.clearAllMocks()
    addBackNavigation.mockReturnValue({ backLink: '/back-link', srcHashParam: '?src=abc123' })
    setInSession.mockReturnValue()
    setPostcodeLookupDetails.mockReturnValue()
  })

  test('should handle cross border from England to Scotland', () => {
    const request = {}
    const oldCountry = 'England'
    const newCountry = 'Scotland'
    const policeResult = null
    const personReference = 'P-123-456'
    const defaultRoute = '/cdo/default-route'
    const res = determineNextScreenAfterAddressChange(request, oldCountry, newCountry, policeResult, personReference, defaultRoute)
    expect(res).toBe('/cdo/edit/country-changed?src=abc123')
  })

  test('should handle cross border from Wales to Scotland', () => {
    const request = {}
    const oldCountry = 'Wales'
    const newCountry = 'Scotland'
    const policeResult = null
    const personReference = 'P-123-456'
    const defaultRoute = '/cdo/default-route'
    const res = determineNextScreenAfterAddressChange(request, oldCountry, newCountry, policeResult, personReference, defaultRoute)
    expect(res).toBe('/cdo/edit/country-changed?src=abc123')
  })

  test('should handle cross border from Scotland to England', () => {
    const request = {}
    const oldCountry = 'Scotland'
    const newCountry = 'England'
    const policeResult = null
    const personReference = 'P-123-456'
    const defaultRoute = '/cdo/default-route'
    const res = determineNextScreenAfterAddressChange(request, oldCountry, newCountry, policeResult, personReference, defaultRoute)
    expect(res).toBe('/cdo/edit/country-changed?src=abc123')
  })

  test('should handle cross border from Scotland to Wales', () => {
    const request = {}
    const oldCountry = 'Scotland'
    const newCountry = 'Wales'
    const policeResult = null
    const personReference = 'P-123-456'
    const defaultRoute = '/cdo/default-route'
    const res = determineNextScreenAfterAddressChange(request, oldCountry, newCountry, policeResult, personReference, defaultRoute)
    expect(res).toBe('/cdo/edit/country-changed?src=abc123')
  })

  test('should handle police force change within same country', () => {
    const request = {}
    const oldCountry = 'England'
    const newCountry = 'England'
    const policeResult = { policeForceResult: { changed: true, policeForceName: 'New Force' } }
    const personReference = 'P-123-456'
    const defaultRoute = '/cdo/default-route'
    const res = determineNextScreenAfterAddressChange(request, oldCountry, newCountry, policeResult, personReference, defaultRoute)
    expect(res).toBe('/cdo/edit/police-force-changed')
  })

  test('should handle police force change when moving from Wales to England', () => {
    const request = {}
    const oldCountry = 'Wales'
    const newCountry = 'England'
    const policeResult = { policeForceResult: { changed: true, policeForceName: 'New Force' } }
    const personReference = 'P-123-456'
    const defaultRoute = '/cdo/default-route'
    const res = determineNextScreenAfterAddressChange(request, oldCountry, newCountry, policeResult, personReference, defaultRoute)
    expect(res).toBe('/cdo/edit/police-force-changed')
  })

  test('should handle police force change when force not found in lookup', () => {
    const request = {}
    const oldCountry = 'England'
    const newCountry = 'England'
    const policeResult = { policeForceResult: { changed: false, reason: 'Not found' } }
    const personReference = 'P-123-456'
    const defaultRoute = '/cdo/default-route'
    const res = determineNextScreenAfterAddressChange(request, oldCountry, newCountry, policeResult, personReference, defaultRoute)
    expect(res).toBe('/cdo/edit/police-force-not-found/P-123-456')
  })

  test('should handle default route', () => {
    const request = {}
    const oldCountry = 'England'
    const newCountry = 'England'
    const policeResult = { policeForceResult: { changed: false } }
    const personReference = 'P-123-456'
    const defaultRoute = '/cdo/default-route'
    const res = determineNextScreenAfterAddressChange(request, oldCountry, newCountry, policeResult, personReference, defaultRoute)
    expect(res).toBe('/cdo/default-route')
  })
})
