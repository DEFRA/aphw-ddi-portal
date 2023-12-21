const { parse, isValid, format } = require('date-fns')
const { UTCDate } = require('@date-fns/utc')

const validDateFormats = [
  'yyyy-MM-dd',
  'yyyy-M-d'
]

const parseDate = (value) => {
  for (const fmt of validDateFormats) {
    const date = parse(value, fmt, new UTCDate())

    if (isValid(date)) {
      return date
    }
  }

  return null
}

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

  if (!iso) {
    return
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

const addDateErrors = (error, prop) => {
  const components = error.path[1] ? [error.path[1]] : error.context.path[1]

  for (const component of components) {
    const item = prop.items.find(item => item.name === component)

    if (item) {
      item.classes += ' govuk-input--error'
    }
  }

  return `${error.path[0]}-${components[0]}`
}

const formatToGds = date => {
  if (date === null || date === undefined) {
    return date
  }

  return format(new Date(date), 'dd MMMM yyyy')
}

module.exports = {
  parseDate,
  dateComponentsToString,
  getDateComponents,
  addDateComponents,
  removeDateComponents,
  addDateErrors,
  formatToGds
}
