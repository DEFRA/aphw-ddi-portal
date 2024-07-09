const { addDateErrors } = require('../lib/date-helpers')

const errorPusherDefault = (errors, model) => {
  console.log('errors2', errors)
  console.log('errors3', errors.details)
  if (errors) {
    for (const error of errors.details) {
      console.log('error4', error)
      const name = error.path[0] ?? error.context.path[0]
      console.log('error5 name', name)
      const prop = model[name]

      if (prop) {
        prop.errorMessage = { text: error.message }
        model.errors.push({ text: error.message, href: `#${name}` })
      }
    }
  }
}

const errorPusherWithDate = (errors, model) => {
  if (errors) {
    for (const error of errors.details) {
      let name = error.path[0] ?? error.context.path[0]
      const prop = model[name]

      if (prop) {
        if (prop.type === 'date') {
          name = addDateErrors(error, prop)
        }

        prop.errorMessage = { text: error.message }
        model.errors.push({ text: error.message, href: `#${name}` })
      }
    }
  }
}

module.exports = {
  errorPusherDefault,
  errorPusherWithDate
}
