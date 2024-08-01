const { routes, views } = require('../../constants/admin')
const { admin } = require('../../auth/permissions')
const ViewModel = require('../../models/admin/pseudonyms')
const { getUsers, createUser, deleteUser } = require('../../api/ddi-events-api/users')
const { getUser } = require('../../auth')
const { validatePseudonymPayload, duplicateEmailSchema } = require('../../schema/portal/admin/pseudonyms')
const { ApiConflictError } = require('../../errors/api-conflict-error')
const { logValidationError } = require('../../lib/log-helpers')

const mapBoomError = (e, request) => {
  const errorPayload = e.boom.payload.error
  let email
  let pseudonym

  if (errorPayload.includes('username')) {
    email = request.payload.email
  }
  if (errorPayload.includes('pseudonym')) {
    pseudonym = request.payload.pseudonym
  }

  const validationPayload = {
    email,
    pseudonym
  }
  const { error } = duplicateEmailSchema.validate(validationPayload, { abortEarly: false })
  return error
}

module.exports = [
  {
    method: 'GET',
    path: `${routes.pseudonyms.get}`,
    options: {
      auth: { scope: [admin] },
      handler: async (request, h) => {
        const users = await getUsers(getUser(request))
        return h.view(views.pseudonyms, new ViewModel({}, users))
      }
    }
  },
  {
    method: 'POST',
    path: `${routes.pseudonyms.post}`,
    options: {
      auth: { scope: [admin] },
      validate: {
        options: {
          abortEarly: false
        },
        payload: async function (payload, options) {
          if (payload.remove) {
            return {
              remove: payload.remove
            }
          }

          return validatePseudonymPayload(payload)
        },
        failAction: async (request, h, error) => {
          logValidationError(error, routes.pseudonyms.post)
          const actioningUser = getUser(request)

          const users = await getUsers(actioningUser)

          return h.view(views.pseudonyms, new ViewModel(request.payload, users, error)).code(400).takeover()
        }
      },
      handler: async (request, h) => {
        const actioningUser = getUser(request)
        let requestPayload = request.payload

        if (request.payload.remove) {
          await deleteUser(request.payload.remove, actioningUser)
        } else {
          const payload = {
            username: request.payload.email,
            pseudonym: request.payload.pseudonym
          }

          try {
            await createUser(payload, actioningUser)
            requestPayload = {}
          } catch (e) {
            if (e instanceof ApiConflictError) {
              const validationError = mapBoomError(e, request)

              const users = await getUsers(actioningUser)
              return h.view(views.pseudonyms, new ViewModel(requestPayload, users, validationError)).code(400)
            }

            throw e
          }
        }

        const users = await getUsers(actioningUser)
        return h.view(views.pseudonyms, new ViewModel(requestPayload, users))
      }
    }
  }
]
