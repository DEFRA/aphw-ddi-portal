const { format } = require('date-fns')
const { UTCDate } = require('@date-fns/utc')

const dateComponentsToString = (payload, prefix) => {
  const year = payload[prefix + '-year']
  const month = payload[prefix + '-month']
  const day = payload[prefix + '-day']

  return `${year}-${month}-${day}`
}

const getDateComponents = (payload, prefix) => {
  const year = payload[prefix + '-year']
  const month = payload[prefix + '-month']
  const day = payload[prefix + '-day']

  return { year, month, day }
}

const addDateComponents = (payload, key) => {
  const iso = payload[key]

  if (iso === undefined) {
    return iso
  }

  const date = new UTCDate(iso)

  payload[`${key}-year`] = date.getFullYear()
  payload[`${key}-month`] = date.getMonth() + 1
  payload[`${key}-day`] = date.getDate()
}

const removeDateComponents = (payload, prefix) => {
  delete payload[prefix + '-year']
  delete payload[prefix + '-month']
  delete payload[prefix + '-day']
}

const formatToGds = date => {
  if (date === null || date === undefined) {
    return date
  }

  return format(new Date(date), 'dd MMMM yyyy')
}

module.exports = {
  dateComponentsToString,
  getDateComponents,
  addDateComponents,
  removeDateComponents,
  formatToGds
}
