const { routes, views, addRemove } = require('../../../../constants/admin')
const { admin } = require('../../../../auth/permissions')
const FormViewModel = require('../../../../models/common/single-submit')
const AddPoliceUsersListFormViewModel = require('../../../../models/admin/users/police/add-list')
const ConfirmPoliceUsersListFormViewModel = require('../../../../models/admin/users/police/confirm-list')
const { validatePayloadBuilder } = require('../../../../schema/common/validatePayload')
const { confirmFlowValidFields } = require('../../../../schema/portal/common/single-submit')
const { getUser } = require('../../../../auth')
const {
  submitEmailSchema, submitEmailConflictSchema, submitEmailSessionConflictSchema, submitListSchema,
  confirmListSchema
} = require('../../../../schema/portal/admin/users')
const { getUsers, addUsers } = require('../../../../api/ddi-index-api/users')
const {
  initialisePoliceUsers, appendPoliceUserToAdd, getPoliceUsersToAdd, setPoliceUsersToAdd, removePoliceUserToAdd,
  changePoliceUserToAdd
} = require('../../../../session/admin/police-users')
const { throwIfPreConditionError } = require('../../../../lib/route-helpers')
const { PoliceOffersAddedViewModel } = require('../../../../models/admin/courts/builder')

const addRemoveConstants = addRemove.policeUserConstants

const fieldNames = {
  recordTypeText: addRemoveConstants.inputField,
  recordType: addRemoveConstants.inputField,
  action: 'add',
  buttonText: `Add ${addRemoveConstants.buttonText}`,
  optionText: 'What is the police officer’s email address?'
}

const addUserStepConstants = {
  backLink: addRemoveConstants.links.index.get,
  ...fieldNames
}

const updateUserStepConstants = {
  backLink: addRemoveConstants.links.addList.get,
  ...fieldNames
}

const throwConflictError = (payload) => {
  validatePayloadBuilder(submitEmailConflictSchema(fieldNames.recordTypeText))(payload)
}

const throwSessionConflictError = (payload) => {
  validatePayloadBuilder(submitEmailSessionConflictSchema(fieldNames.recordTypeText))(payload)
}

const addUserPostCheck = {
  method: async request => {
    validatePayloadBuilder(submitEmailSchema)(request.payload)
    const validatedPayload = validatePayloadBuilder(submitEmailSchema)(request.payload)

    const policeUsers = await getUsers(getUser(request))
    const policeUsersInSession = getPoliceUsersToAdd(request)

    if (policeUsersInSession.some(username => username?.toLowerCase() === validatedPayload.policeUser.toLowerCase())) {
      throwSessionConflictError(request.payload)
    }

    if (policeUsers.some(({ username }) => username?.toLowerCase() === validatedPayload.policeUser.toLowerCase())) {
      throwConflictError(request.payload)
    }

    return { username: validatedPayload.policeUser, id: validatedPayload.policeUserIndex }
  },
  failAction: (request, h, error) => {
    const recordValue = request.payload[addRemoveConstants.inputField]

    return h.view(views.addAdminRecord, new FormViewModel({
      ...addUserStepConstants,
      recordValue
    }, undefined, error)).code(400).takeover()
  },
  assign: 'inputField'
}

const updateUserPostCheck = {
  method: async request => {
    validatePayloadBuilder(submitEmailSchema)(request.payload)
    const validatedPayload = validatePayloadBuilder(submitEmailSchema)(request.payload)

    const policeUsers = await getUsers(getUser(request))
    const policeUsersInSession = getPoliceUsersToAdd(request)
    const prevUsername = policeUsersInSession[validatedPayload.policeUserIndex]
    const newUsername = validatedPayload.policeUser
    const otherPoliceUsersInSession = policeUsersInSession.filter(username => username !== prevUsername)

    if (otherPoliceUsersInSession.some(username => username?.toLowerCase() === newUsername.toLowerCase())) {
      throwSessionConflictError(request.payload)
    }

    if (policeUsers.some(({ username }) => username?.toLowerCase() === newUsername.toLowerCase())) {
      throwConflictError(request.payload)
    }

    return { username: validatedPayload.policeUser, id: validatedPayload.policeUserIndex }
  },
  failAction: (request, h, error) => {
    const recordValue = request.payload[addRemoveConstants.inputField]

    return h.view(views.addAdminRecord, new FormViewModel({
      ...updateUserStepConstants,
      recordValue,
      update: true,
      updateId: request.payload.policeUserIndex,
      updateName: 'policeUserIndex'
    }, undefined, error)).code(400).takeover()
  },
  assign: 'inputField'
}

module.exports = [
  {

    method: 'GET',
    path: `${routes.addPoliceUser.get}`,
    options: {
      auth: { scope: [admin] },
      handler: async (request, h) => {
        const details = {
          ...addUserStepConstants,
          backLink: getPoliceUsersToAdd(request).length ? addRemoveConstants.links.addList.get : addRemoveConstants.links.index.get
        }
        return h.view(views.addAdminRecord, new FormViewModel(details))
      }
    }
  },
  {

    method: 'GET',
    path: `${routes.addUpdatePoliceUser.get}/{policeUserId}`,
    options: {
      auth: { scope: [admin] },
      handler: async (request, h) => {
        const users = getPoliceUsersToAdd(request)
        const updateId = parseInt(request.params.policeUserId)
        const recordValue = users[updateId]

        const model = new FormViewModel({
          ...updateUserStepConstants,
          recordValue,
          update: true,
          updateId,
          updateName: 'policeUserIndex'
        })

        return h.view(views.addAdminRecord, model)
      }
    }
  },
  {
    method: 'POST',
    path: `${routes.addPoliceUser.post}`,
    options: {
      auth: { scope: [admin] },
      validate: {
        payload: validatePayloadBuilder(confirmFlowValidFields(addRemoveConstants.inputField, ['conflict', 'policeUserIndex']))
      },
      pre: [
        addUserPostCheck
      ],
      handler: async (request, h) => {
        throwIfPreConditionError(request)

        if (typeof request.pre.inputField.id === 'number') {
          changePoliceUserToAdd(request, request.pre.inputField.id, request.pre.inputField.username)
        } else {
          appendPoliceUserToAdd(request, request.pre.inputField.username)
        }

        return h.redirect(addRemoveConstants.links.addList.get)
      }
    }
  },
  {
    method: 'POST',
    path: `${routes.addUpdatePoliceUser.post}/{policeUserIndex}`,
    options: {
      auth: { scope: [admin] },
      validate: {
        payload: validatePayloadBuilder(submitEmailSchema),
        failAction: async (request, h, error) => {
          const backLink = addRemoveConstants.links.addList.get
          const model = new FormViewModel({
            ...updateUserStepConstants,
            recordValue: request.payload.policeUser,
            update: true,
            updateId: request.payload.policeUserIndex,
            updateName: 'policeUserIndex',
            backLink
          }, undefined, error)

          return h.view(views.addAdminRecord, model).code(400).takeover()
        }
      },
      pre: [
        updateUserPostCheck
      ],
      handler: async (request, h) => {
        throwIfPreConditionError(request)

        changePoliceUserToAdd(request, request.pre.inputField.id, request.pre.inputField.username)

        return h.redirect(addRemoveConstants.links.addList.get)
      }
    }
  },
  {

    method: 'GET',
    path: `${routes.listPoliceUsersToAdd.get}`,
    options: {
      auth: { scope: [admin] },
      handler: async (request, h) => {
        const policeUsers = getPoliceUsersToAdd(request)
        const backlink = routes.addPoliceUser.get
        const model = new AddPoliceUsersListFormViewModel({
          users: policeUsers,
          backlink
        })

        return h.view(views.addPoliceUserList, model)
      }
    }
  },
  {

    method: 'POST',
    path: `${routes.listPoliceUsersToAdd.get}`,
    options: {
      auth: { scope: [admin] },
      validate: {
        payload: validatePayloadBuilder(submitListSchema),
        failAction: async (request, h, error) => {
          const policeUsers = getPoliceUsersToAdd(request)

          const backlink = routes.addPoliceUser.get
          const model = new AddPoliceUsersListFormViewModel({
            users: policeUsers,
            backlink
          }, undefined, error)

          return h.view(views.addPoliceUserList, model).code(400).takeover()
        }
      },
      handler: async (request, h) => {
        setPoliceUsersToAdd(request, request.payload.users)

        if (request.payload.addAnother) {
          return h.redirect(routes.addPoliceUser.get)
        }

        return h.redirect(routes.confirmPoliceUsersToAdd.get)
      }
    }
  },
  {
    method: 'GET',
    path: `${routes.addRemovePoliceUser.get}/{policeUserSessionId}`,
    options: {
      auth: { scope: [admin] },
      handler: async (request, h) => {
        const users = removePoliceUserToAdd(request, parseInt(request.params.policeUserSessionId))

        const redirectPath = users.length ? addRemoveConstants.links.addList.get : addRemoveConstants.links.index.get

        return h.redirect(redirectPath)
      }
    }
  },
  {
    method: 'GET',
    path: `${routes.confirmPoliceUsersToAdd.get}`,
    options: {
      auth: { scope: [admin] },
      handler: async (request, h) => {
        const policeUsers = getPoliceUsersToAdd(request)
        const backlink = routes.listPoliceUsersToAdd.get

        const model = new ConfirmPoliceUsersListFormViewModel({
          users: policeUsers,
          backlink
        })

        return h.view(views.addPoliceUserConfirm, model)
      }
    }
  },
  {
    method: 'POST',
    path: `${routes.confirmPoliceUsersToAdd.post}`,
    options: {
      auth: { scope: [admin] },
      validate: {
        payload: validatePayloadBuilder(confirmListSchema),
        failAction: async (request, h, error) => {
          const policeUsers = getPoliceUsersToAdd(request)
          const backlink = routes.listPoliceUsersToAdd.get

          const model = new ConfirmPoliceUsersListFormViewModel({
            users: policeUsers,
            backlink
          }, undefined, error)

          return h.view(views.addPoliceUserConfirm, model).code(400).takeover()
        }
      },
      handler: async (request, h) => {
        const policeUsers = await addUsers(request.payload.users, getUser(request))

        initialisePoliceUsers(request)

        const model = PoliceOffersAddedViewModel(policeUsers.users.success)

        return h.view(views.success, model)
      }
    }
  }
]
