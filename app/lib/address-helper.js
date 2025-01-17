const shuffleAddress = (address) => {
  const addrParts = []
  if (address?.ddi_address_line_1 && address?.ddi_address_line_1 !== '') {
    addrParts.push(address.ddi_address_line_1)
  }
  if (address?.ddi_address_line_2 && address?.ddi_address_line_2 !== '') {
    addrParts.push(address.ddi_address_line_2)
  }
  if (address?.ddi_town && address?.ddi_town !== '') {
    addrParts.push(address.ddi_town)
  }
  if (address?.ddi_postcode && address?.ddi_postcode !== '') {
    addrParts.push(address.ddi_postcode)
  }

  if (addrParts.length < 4) {
    const blankRowsRequired = 4 - addrParts.length
    for (let i = 0; i < blankRowsRequired; i++) {
      addrParts.push('')
    }
  }

  return {
    ddi_address_line_1: addrParts[0],
    ddi_address_line_2: addrParts[1],
    ddi_town: addrParts[2],
    ddi_postcode: addrParts[3]
  }
}

const shuffleFieldDataIfNeeded = (fieldData) => {
  if ((fieldData.ddi_address_line_1 || fieldData.ddi_address_line_2) && fieldData.ddi_postcode) {
    const address = shuffleAddress(fieldData)
    return { ...fieldData, ...address }
  }
  return fieldData
}

module.exports = {
  shuffleAddress,
  shuffleFieldDataIfNeeded
}
