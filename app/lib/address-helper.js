const isStringSupplied = (str) => {
  return str && str !== ''
}

const preparePostalNameAndAddress = (fieldData) => {
  const addrParts = []
  if (isStringSupplied(fieldData?.ddi_owner_name)) {
    addrParts.push(fieldData.ddi_owner_name)
  }
  if (isStringSupplied(fieldData?.ddi_address_line_1)) {
    addrParts.push(fieldData.ddi_address_line_1)
  }
  if (isStringSupplied(fieldData?.ddi_address_line_2)) {
    addrParts.push(fieldData.ddi_address_line_2)
  }
  if (isStringSupplied(fieldData?.ddi_town)) {
    addrParts.push(fieldData.ddi_town)
  }
  if (isStringSupplied(fieldData?.ddi_postcode)) {
    addrParts.push(fieldData.ddi_postcode)
  }

  return addrParts.join('\n')
}

module.exports = {
  preparePostalNameAndAddress,
  isStringSupplied
}
