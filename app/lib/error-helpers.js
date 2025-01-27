const { addDateErrors } = require('../lib/date-helpers')

/**
 * @callback PropCreator
 * @param name
 * @param model
 * @returns {{errorMessage: {text:string}|{html:string}}}
 */

/**
 * @type {PropCreator}
 */
const defaultPropCreator = (name, model) => model[name]

/**
 * @param errors
 * @param model
 * @param {PropCreator} propCreator
 */
const errorPusherDefault = (errors, model, propCreator = defaultPropCreator) => {
  if (errors) {
    for (const error of errors.details) {
      const name = error.path[0] ?? error.context.path[0]
      const prop = propCreator(name, model)

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
  errorPusherWithDate,
  defaultPropCreator
}
