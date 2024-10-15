const statuses = {
  InterimExempt: 'Interim exempt',
  PreExempt: 'Pre-exempt',
  Exempt: 'Exempt',
  Failed: 'Failed',
  InBreach: 'In breach',
  Withdrawn: 'Withdrawn',
  Inactive: 'Inactive'
}

const inactiveSubStatuses = {
  dead: 'Dog dead',
  exported: 'Dog exported',
  stolen: 'Reported stolen',
  untraceable: 'Owner untraceable'
}

module.exports = {
  statuses,
  inactiveSubStatuses
}
