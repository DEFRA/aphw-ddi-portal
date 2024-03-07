const validNewMicrochip = /^[0-9]+$/

const validateMicrochip = (value, helpers, compareOrig = false) => {
  let elemName = helpers.state.path[0]
  console.log('here0.1 elemName', elemName)

  // Compare new value against original to determine if already pre-populated in the DB
  // (old microchip numbers from legacy data can contain letters so don't validate against new rules)
  if (compareOrig) {
    if (elemName?.length > 1) {
      elemName = elemName.substring(0, 1).toUpperCase() + elemName.substring(1)
    }
    if (value === helpers.state.ancestors[0][`orig${elemName}`]) {
      return value
    }
  }

  if (!value.match(validNewMicrochip)) {
    return helpers.message('Microchip numbers can only contain numbers', { path: [elemName] })
  }

  return value
}

module.exports = {
  validateMicrochip
}
