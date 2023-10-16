const { parse, format } = require('date-fns')
const { routes } = require('../../../constants/owner')

const formatDate = date => {
  const options = {
    locale: 'enGB'
  }

  if (date === null || date === undefined) {
    return null
  }

  const dateString = `${date.year}-${date.month}-${date.day}`

  const parsedDate = parse(dateString, 'yyyy-MM-dd', new Date(), options)

  return format(parsedDate, 'dd MMMM yyyy')
}

const formatName = name => {
  if (name === null || name === undefined) {
    return name
  }

  const title = name?.title
  const firstName = name?.firstName
  const lastName = name?.lastName

  return `${title} ${firstName} ${lastName}`
}

function ViewModel (owner, error) {
  this.model = {
    formAction: routes.summary.post,
    summary: {
      owner: {
        name: formatName(owner.name),
        dateOfBirth: formatDate(owner.dateOfBirth),
        phone: owner.phoneNumber,
        email: owner.email,
        address: []
      },
      error
    }
  }

  const address = owner.address

  if (address !== null && address !== undefined) {
    Object.keys(address).forEach(key => {
      if (address[key]) {
        this.model.summary.owner.address.push(address[key])
      }
    })
  }
}

module.exports = ViewModel
