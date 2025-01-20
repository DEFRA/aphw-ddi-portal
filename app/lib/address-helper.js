const preparePostalNameAndAddress = (fieldData) => {
  const addrParts = []
  if (fieldData?.ddi_owner_name && fieldData?.ddi_owner_name !== '') {
    addrParts.push(fieldData.ddi_owner_name)
  }
  if (fieldData?.ddi_address_line_1 && fieldData?.ddi_address_line_1 !== '') {
    addrParts.push(fieldData.ddi_address_line_1)
  }
  if (fieldData?.ddi_address_line_2 && fieldData?.ddi_address_line_2 !== '') {
    addrParts.push(fieldData.ddi_address_line_2)
  }
  if (fieldData?.ddi_town && fieldData?.ddi_town !== '') {
    addrParts.push(fieldData.ddi_town)
  }
  if (fieldData?.ddi_postcode && fieldData?.ddi_postcode !== '') {
    addrParts.push(fieldData.ddi_postcode)
  }

  return addrParts.join('\n')
}

module.exports = {
  preparePostalNameAndAddress
}
