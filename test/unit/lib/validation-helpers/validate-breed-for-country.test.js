const { validateBreedForCountry } = require('../../../../app/lib/validation-helpers')

const mockHelpers = {
  state: {
    path: ['breed'],
    ancestors: [{
      country: 'Dummy'
    }]
  },
  message: (a, b) => { return { error: a, elemName: b } }
}

describe('ValidationHelpers - validaBreedForCountry', () => {
  test('handles scotland and not XLB', () => {
    const value = 'Breed 1'
    mockHelpers.state.ancestors[0].country = 'Scotland'
    const res = validateBreedForCountry(value, mockHelpers)
    expect(res).toBe('Breed 1')
  })

  test('handles england and not XLB', () => {
    const value = 'Breed 1'
    mockHelpers.state.ancestors[0].country = 'England'
    const res = validateBreedForCountry(value, mockHelpers)
    expect(res).toBe('Breed 1')
  })

  test('handles wales and not XLB', () => {
    const value = 'Breed 1'
    mockHelpers.state.ancestors[0].country = 'Wales'
    const res = validateBreedForCountry(value, mockHelpers)
    expect(res).toBe('Breed 1')
  })

  test('handles scotland and XLB', () => {
    const value = 'XL Bully'
    mockHelpers.state.ancestors[0].country = 'Scotland'
    const res = validateBreedForCountry(value, mockHelpers)
    expect(res).toEqual({ elemName: { path: ['breed'] }, error: 'The address for an XL Bully dog must be in England or Wales' })
  })

  test('handles england and XLB', () => {
    const value = 'XL Bully'
    mockHelpers.state.ancestors[0].country = 'England'
    const res = validateBreedForCountry(value, mockHelpers)
    expect(res).toBe('XL Bully')
  })

  test('handles wales and XLB', () => {
    const value = 'XL Bully'
    mockHelpers.state.ancestors[0].country = 'Wales'
    const res = validateBreedForCountry(value, mockHelpers)
    expect(res).toBe('XL Bully')
  })
})
