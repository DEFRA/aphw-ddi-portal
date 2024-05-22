const { validateMicrochip } = require('../../../../app/lib/validation-helpers')

const mockMicrochipHelpers = {
  state: {
    path: ['microchipNumber'],
    ancestors: []
  },
  message: (a, b) => { return { error: a, elemName: b } }
}

describe('ValidationHelpers - validateMicrochip', () => {
  beforeEach(() => {
    mockMicrochipHelpers.state.ancestors = []
  })

  test('handles valid microchip', () => {
    const value = '123456789012345'

    const res = validateMicrochip(value, mockMicrochipHelpers, false)

    expect(res).toBe('123456789012345')
  })

  test('handles valid microchip with default param', () => {
    const value = '123456789012345'

    const res = validateMicrochip(value, mockMicrochipHelpers)

    expect(res).toBe('123456789012345')
  })

  test('gives error if microchip 1 too short', () => {
    const value = '12345678901234'

    const res = validateMicrochip(value, mockMicrochipHelpers, false)

    expect(res).toEqual({
      elemName: {
        path: ['microchipNumber']
      },
      error: 'Microchip numbers must be 15 numbers long'
    })
  })

  test('gives error if invalid microchip 1', () => {
    const value = '12345678901234x'

    const res = validateMicrochip(value, mockMicrochipHelpers, false)

    expect(res).toEqual({
      elemName: {
        path: ['microchipNumber']
      },
      error: 'Microchip numbers can only contain numbers'
    })
  })

  test('gives error if invalid microchip 2', () => {
    const value = '123456-78012345'

    const res = validateMicrochip(value, mockMicrochipHelpers, false)

    expect(res).toEqual({
      elemName: {
        path: ['microchipNumber']
      },
      error: 'Microchip numbers can only contain numbers'
    })
  })

  test('gives error if invalid microchip 3', () => {
    const value = '123456 78012345'

    const res = validateMicrochip(value, mockMicrochipHelpers, false)

    expect(res).toEqual({
      elemName: {
        path: ['microchipNumber']
      },
      error: 'Microchip numbers can only contain numbers'
    })
  })

  test('allows invalid microchip if no change from original microchip', () => {
    const value = '123456x78'

    mockMicrochipHelpers.state.ancestors = [
      { origMicrochipNumber: '123456x78' }
    ]

    const res = validateMicrochip(value, mockMicrochipHelpers, true)

    expect(res).toBe('123456x78')
  })

  test('fails invalid microchip if some change from original microchip', () => {
    const value = '123456x78012345'

    mockMicrochipHelpers.state.ancestors = [
      { origMicrochipNumber: '123456x7899' }
    ]

    const res = validateMicrochip(value, mockMicrochipHelpers, true)

    expect(res).toEqual({
      elemName: {
        path: ['MicrochipNumber']
      },
      error: 'Microchip numbers can only contain numbers'
    })
  })
})
