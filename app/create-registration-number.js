const { v4: uuidv4 } = require('uuid')

module.exports = () => {
  const id = uuidv4()
  const reg = id.split('-').shift().toLocaleUpperCase('en-GB').match(/.{1,4}/g).join('-')
  return `REG-${reg}`
}
