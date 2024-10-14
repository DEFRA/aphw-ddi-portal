const { getNewStatusLabel } = require('../../../app/lib/status-helper')
describe('status helper', () => {
  test('should change Pre-exempt', () => {
    const dog = { status: 'Pre-exempt' }
    const label = getNewStatusLabel(dog)
    expect(label).toBe('Applying for exemption')
  })

  test('should change Failed', () => {
    const dog = { status: 'Failed' }
    const label = getNewStatusLabel(dog)
    expect(label).toBe('Failed to exempt dog')
  })

  test('should change Withdrawn', () => {
    const dog = { status: 'Withdrawn' }
    const label = getNewStatusLabel(dog)
    expect(label).toBe('Withdrawn by owner')
  })

  test('should change Inactive with no sub-status', () => {
    const dog = { status: 'Inactive' }
    const label = getNewStatusLabel(dog)
    expect(label).toBe('Inactive')
  })

  test('should change Inactive with sub-status dead', () => {
    const dog = { status: 'Inactive', death_date: '2024-05-15' }
    const label = getNewStatusLabel(dog)
    expect(label).toBe('Dog dead')
  })

  test('should change Inactive with sub-status exported', () => {
    const dog = { status: 'Inactive', exported_date: '2024-05-15' }
    const label = getNewStatusLabel(dog)
    expect(label).toBe('Dog exported')
  })

  test('should change Inactive with sub-status stolen', () => {
    const dog = { status: 'Inactive', stolen_date: '2024-05-15' }
    const label = getNewStatusLabel(dog)
    expect(label).toBe('Reported stolen')
  })

  test('should change Inactive with sub-status untraceable', () => {
    const dog = { status: 'Inactive', untraceable_date: '2024-05-15' }
    const label = getNewStatusLabel(dog)
    expect(label).toBe('Owner untraceable')
  })

  test('should not change an unknown value', () => {
    const dog = { status: 'adfdasfdfadf' }
    const label = getNewStatusLabel(dog)
    expect(label).toBe('adfdasfdfadf')
  })
})
