/**
 * @param {string} variableName
 * @return {string|undefined}
 */
const getEnvironmentVariable = (variableName) => {
  return process.env[variableName]
}

const getEnvironmentVariableOrString = (variableName) => {
  return process.env[variableName] !== undefined ? process.env[variableName] : ''
}

module.exports = {
  getEnvironmentVariable,
  getEnvironmentVariableOrString
}
