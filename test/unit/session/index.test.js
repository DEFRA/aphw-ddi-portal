const { clearCdo } = require('../../../app/session/cdo')

jest.mock('../../../app/session/cdo/dog')
const { clearAllDogs, setExistingDogs, setMicrochipResults } = require('../../../app/session/cdo/dog')

jest.mock('../../../app/session/cdo/owner')
const { setOwnerDetails, setAddress, setEnforcementDetails } = require('../../../app/session/cdo/owner')

describe('index session storage', () => {
  const mockRequest = {
    yar: {
      get: jest.fn(),
      set: jest.fn()
    }
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('clearCdo calls necessary methods to clear CDO from session', () => {
    clearCdo(mockRequest)

    expect(clearAllDogs).toHaveBeenCalledTimes(1)
    expect(setOwnerDetails).toHaveBeenCalledWith(expect.anything(), null)
    expect(setAddress).toHaveBeenCalledWith(expect.anything(), null)
    expect(setEnforcementDetails).toHaveBeenCalledWith(expect.anything(), null)
    expect(setExistingDogs).toHaveBeenCalledWith(expect.anything(), [])
    expect(setMicrochipResults).toHaveBeenCalledWith(expect.anything(), [])
  })
})
