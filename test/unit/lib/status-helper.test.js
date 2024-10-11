const { getNewStatusLabel } = require('../../../app/lib/status-helper')
describe('status helper', () => {
  test('should change Pre-exempt', () => {
    const start = 'Pre-exempt'
    const label = getNewStatusLabel(start)
    expect(label).toBe('Applying for exemption')
  })

  test('should change Failed', () => {
    const start = 'Failed'
    const label = getNewStatusLabel(start)
    expect(label).toBe('Failed to exempt dog')
  })

  test('should change Withdrawn', () => {
    const start = 'Withdrawn'
    const label = getNewStatusLabel(start)
    expect(label).toBe('Withdrawn by owner')
  })

  test('should not change an unknown value', () => {
    const start = 'adfdasfdfadf'
    const label = getNewStatusLabel(start)
    expect(label).toBe('adfdasfdfadf')
  })
})
