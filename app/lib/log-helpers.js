const logValidationError = (errors, routeName = 'unknown') => {
  if (errors) {
    console.warn('details', errors.details)
    console.warn('details count', errors.details.length)
    for (const error of errors.details) {
      const elemName = error.path ? error.path[0] : error.context?.path[0]
      console.log(`Validation error in ${routeName}: elementName=${elemName} message=${error.message}`)
    }
  }
}

module.exports = {
  logValidationError
}
