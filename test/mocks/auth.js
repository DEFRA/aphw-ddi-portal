const { generateKeyPairSync } = require('crypto')
const { admin, standard } = require('../../app/auth/permissions')

const user = {
  userId: '1',
  username: 'test@example.com',
  scopes: [admin]
}

const userForAuth = {
  username: 'test@example.com',
  name: 'Example Tester',
  homeAccountId: '1',
  scopes: [standard]
}

const userWithDisplayname = {
  userId: '1',
  username: 'test@example.com',
  displayname: 'Example Tester',
  scopes: [admin]
}

const auth = { strategy: 'session-auth', credentials: { scope: [admin], account: userForAuth } }

const standardAuth = { strategy: 'session-auth', credentials: { scope: [standard], account: userForAuth } }

const adminAuth = auth

const generateKeyStubs = () => {
  const { privateKey: privateKeyObj, publicKey: publicKeyObj } = generateKeyPairSync('rsa', {
    modulusLength: 2048
  })

  const privateKeyPem = privateKeyObj.export({ format: 'pem', type: 'pkcs8' })
  const publicKeyPem = publicKeyObj.export({ format: 'pem', type: 'spki' })

  const privateKey = privateKeyPem.toString('base64')
  const publicKey = publicKeyPem.toString('base64')

  return {
    privateKey,
    publicKey,
    privateKeyHash: Buffer.from(privateKey).toString('base64'),
    publicKeyHash: Buffer.from(publicKey).toString('base64')
  }
}

const keyStubs = generateKeyStubs()

module.exports = {
  auth,
  adminAuth,
  standardAuth,
  userWithDisplayname,
  user,
  userForAuth,
  generateKeyStubs,
  keyStubs
}
