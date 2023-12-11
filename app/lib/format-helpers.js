const formatAddress = (address) => {
  if (!address) {
    return null
  }

  const parts = []

  Object.keys(address).forEach(key => {
    if (address[key]) {
      parts.push(address[key])
    }
  })

  return parts
}

module.exports = {
  formatAddress
}
