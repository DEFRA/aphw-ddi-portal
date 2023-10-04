const key = 'OWNER'

const getOwner = session => {
  const owner = session.get(key) ?? {}

  return owner
}

const setOwnerName = (session, payload) => {
  const owner = getOwner(session)

  owner.firstName = payload.firstName
  owner.lastName = payload.lastName

  session.set(key, owner)

  return owner
}

const setOwnerPostcode = (session, payload) => {
  const owner = getOwner(session)

  owner.address = {
    postcode: payload.postcode
  }

  session.set(key, owner)

  return owner
}

const setOwnerAddress = (session, payload) => {
  const owner = getOwner(session)

  owner.address = {
    addressLine1: payload.addressLine1,
    addressLine2: payload.addressLine2,
    addressLine3: payload.addressLine3,
    town: payload.addressTown,
    county: payload.addressCounty,
    postcode: payload.addressPostcode
  }

  session.set(key, owner)

  return owner
}

const setOwnerKeeper = (session, payload) => {
  const owner = getOwner(session)

  owner.isKeeper = payload.isKeeper === 'yes'

  session.set(key, owner)

  return owner
}

module.exports = {
  getOwner,
  setOwnerName,
  setOwnerPostcode,
  setOwnerAddress,
  setOwnerKeeper
}
