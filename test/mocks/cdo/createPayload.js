const valid = {
  owner: {
    firstName: 'Shaun',
    lastName: 'Fitzsimons',
    dateOfBirth: '1998-05-10',
    address: {
      addressLine1: '14 Fake Street',
      town: 'Fake Town',
      postcode: 'FA1 2KE'
    }
  },
  enforcementDetails: {
    legislationOfficer: 'Joe Bloggs',
    policeForce: '1',
    court: '1'
  },
  dogs: [
    {
      breed: 'Pit Bull Terrier',
      name: 'Buster',
      applicationType: 'cdo',
      cdoIssued: '2023-10-10',
      cdoExpiry: '2023-12-10'
    },
    {
      breed: 'XL Bully',
      name: 'Alice',
      applicationType: 'cdo',
      cdoIssued: '2023-10-10',
      cdoExpiry: '2023-12-10'
    }
  ]
}

const validWithCountry = {
  owner: {
    firstName: 'Homer',
    lastName: 'Simpson',
    dateOfBirth: '1998-05-10',
    address: {
      addressLine1: '1 Anywhere St',
      addressLine2: 'Anywhere Estate',
      town: 'Pontypridd',
      postcode: 'CF15 7SU',
      country: 'Wales'
    }
  },
  enforcementDetails: {
    court: '1',
    policeForce: '1',
    legislationOfficer: 'Sidney Lewis'
  },
  dogs: [
    {
      breed: 'XL Bully',
      name: 'Rex',
      applicationType: 'cdo',
      cdoIssued: '2023-10-10',
      cdoExpiry: '2023-12-10'
    }
  ]
}

const validWithCountryAndPersonReference = {
  owner: {
    firstName: 'Homer',
    lastName: 'Simpson',
    dateOfBirth: '1998-05-10',
    personReference: 'P-6076-A37C',
    address: {
      addressLine1: '1 Anywhere St',
      addressLine2: 'Anywhere Estate',
      town: 'Pontypridd',
      postcode: 'CF15 7SU',
      country: 'Wales'
    }
  },
  enforcementDetails: {
    court: '1',
    policeForce: '1',
    legislationOfficer: 'Sidney Lewis'
  },
  dogs: [
    {
      breed: 'XL Bully',
      name: 'Rex',
      applicationType: 'cdo',
      cdoIssued: '2023-10-10',
      cdoExpiry: '2023-12-10'
    }
  ]
}

const invalid = {
  owner: {
    dateOfBirth: '1998-05-10',
    address: {
      addressLine1: '14 Fake Street',
      town: 'Fake Town',
      postcode: 'FA1 2KE'
    }
  },
  enforcementDetails: {
    legislationOfficer: 'Joe Bloggs',
    policeForce: '1',
    court: '1'
  },
  dogs: [
    {
      breed: 'Pit Bull Terrier',
      name: 'Buster',
      applicationType: 'cdo',
      cdoIssued: '2023-10-10',
      cdoExpiry: '2023-12-10'
    },
    {
      breed: 'XL Bully',
      name: 'Alice',
      applicationType: 'cdo',
      cdoIssued: '2023-10-10'
    }
  ]
}

module.exports = {
  valid,
  validWithCountry,
  validWithCountryAndPersonReference,
  invalid
}
