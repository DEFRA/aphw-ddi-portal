const logValidationError = (errors, routeName = 'unknown') => {
  if (errors) {
    for (const error of errors.details) {
      const elemName = error.path ? error.path[0] : error.context?.path[0]
      console.log(`Validation error in ${routeName}: elementName=${elemName} message=${error.message}`)
    }
  }
}

module.exports = {
  logValidationError
}
