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
      cdoIssued: '2023-10-10',
      cdoExpiry: '2023-12-10'
    },
    {
      breed: 'XL Bully',
      name: 'Alice',
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
      cdoIssued: '2023-10-10',
      cdoExpiry: '2023-12-10'
    },
    {
      breed: 'XL Bully',
      name: 'Alice',
      cdoIssued: '2023-10-10'
    }
  ]
}

module.exports = {
  valid,
  invalid
}
