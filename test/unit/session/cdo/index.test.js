const { getCreatedCdo, setCreatedCdo, getCreatedCdoKey } = require('../../../../app/session/cdo')
const { UTCDate } = require('@date-fns/utc')

describe('cdo session helpers', () => {
  const mockRequest = {
    yar: {
      get: jest.fn(),
      set: jest.fn()
    }
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('getCreatedCdoKey', () => {
    mockRequest.yar.get.mockReturnValue({
      owner: {
        firstName: 'Test',
        lastName: 'User'
      },
      enforcementDetails: {
        court: 'Test Court',
        policeForce: 'Test Force'
      },
      dogs: [{
        breed: 'Breed 1',
        name: 'Bruce',
        cdoIssued: new UTCDate('2020-10-10T00:00:00.000Z'),
        cdoExpiry: new UTCDate('2020-12-10T00:00:00.000Z')
      }]
    })

    const enforcementDetails = getCreatedCdoKey(mockRequest, 'createdCdo', 'enforcementDetails')
    expect(mockRequest.yar.get).toHaveBeenCalledWith('createdCdo')
    expect(enforcementDetails).toEqual({
      court: 'Test Court',
      policeForce: 'Test Force'
    })
  })

  test('getCreatedCdoKey with no yar in session', () => {
    const createdCdo = getCreatedCdoKey({}, 'createdCdo')
    const enforcementDetails = getCreatedCdoKey({}, 'createdCdo', 'enforcementDetails')

    expect(createdCdo).toBeUndefined()
    expect(enforcementDetails).toBeUndefined()
  })

  test('getCreatedCdo returns saved cdo from session', () => {
    mockRequest.yar.get.mockReturnValue({
      owner: {
        firstName: 'Test',
        lastName: 'User'
      },
      enforcementDetails: {
        court: 'Test Court',
        policeForce: 'Test Force'
      },
      dogs: [{
        breed: 'Breed 1',
        name: 'Bruce',
        cdoIssued: new UTCDate('2020-10-10T00:00:00.000Z'),
        cdoExpiry: new UTCDate('2020-12-10T00:00:00.000Z')
      }]
    })

    const cdo = getCreatedCdo(mockRequest)

    expect(mockRequest.yar.get).toHaveBeenCalledTimes(1)
    expect(mockRequest.yar.get).toHaveBeenCalledWith('createdCdo')
    expect(cdo).toEqual({
      owner: {
        firstName: 'Test',
        lastName: 'User'
      },
      enforcementDetails: {
        court: 'Test Court',
        policeForce: 'Test Force'
      },
      dogs: [{
        breed: 'Breed 1',
        name: 'Bruce',
        cdoIssued: new UTCDate('2020-10-10T00:00:00.000Z'),
        cdoExpiry: new UTCDate('2020-12-10T00:00:00.000Z')
      }]
    })
  })

  test('setCreatedCdo sets cdo in session', () => {
    mockRequest.yar.get.mockReturnValue(undefined)

    const cdo = {
      owner: {
        firstName: 'Test',
        lastName: 'User'
      },
      enforcementDetails: {
        court: 'Test Court',
        policeForce: 'Test Force'
      },
      dogs: [{
        breed: 'Breed 1',
        name: 'Bruce',
        cdoIssued: new UTCDate('2020-10-10T00:00:00.000Z'),
        cdoExpiry: new UTCDate('2020-12-10T00:00:00.000Z')
      }]
    }

    setCreatedCdo(mockRequest, cdo)

    expect(mockRequest.yar.set).toHaveBeenCalledTimes(1)
    expect(mockRequest.yar.set).toHaveBeenCalledWith('createdCdo', {
      owner: {
        firstName: 'Test',
        lastName: 'User'
      },
      enforcementDetails: {
        court: 'Test Court',
        policeForce: 'Test Force'
      },
      dogs: [{
        breed: 'Breed 1',
        name: 'Bruce',
        cdoIssued: new UTCDate('2020-10-10T00:00:00.000Z'),
        cdoExpiry: new UTCDate('2020-12-10T00:00:00.000Z')
      }]
    })
  })
})
