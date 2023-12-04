const { format } = require('date-fns')

const formatToGds = date => {
  if (date === null || date === undefined) {
    return date
  }

  return format(new Date(date), 'dd MMMM yyyy')
}

module.exports = {
  formatToGds
}
