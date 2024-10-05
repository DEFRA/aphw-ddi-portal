const { routes, views, addRemove } = require('../../../../constants/admin')
const { admin } = require('../../../../auth/permissions')
const FormViewModel = require('../../../../models/common/single-submit')
const AddPoliceUsersListFormViewModel = require('../../../../models/admin/users/police/add-list')
const { validatePayloadBuilder } = require('../../../../schema/common/validatePayload')
const { confirmFlowValidFields } = require('../../../../schema/portal/common/single-submit')
const { getUser } = require('../../../../auth')
const { submitEmailSchema, submitEmailConflictSchema, submitEmailSessionConflictSchema } = require('../../../../schema/portal/admin/users')
const { getUsers } = require('../../../../api/ddi-index-api/users')
const { initialisePoliceUsers, appendPoliceUserToAdd, getPoliceUsersToAdd } = require('../../../../session/admin/police-users')
const { throwIfPreConditionError } = require('../../../../lib/route-helpers')
const Joi = require('joi')

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

    if (policeUsersInSession.some(username => username === validatedPayload.policeUser)) {
      throwSessionConflictError(request.payload)
    }

    if (policeUsers.some(({ username }) => username === validatedPayload.policeUser)) {
      throwConflictError(request.payload)
    }

    return validatedPayload.policeUser
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

module.exports = [
  {

    method: 'GET',
    path: `${routes.addPoliceUser.get}`,
    options: {
      auth: { scope: [admin] },
      handler: async (request, h) => {
        if (request.query.step === 'start') {
          initialisePoliceUsers(request, [])
        }
        return h.view(views.addAdminRecord, new FormViewModel(addUserStepConstants))
      }
    }
  },
  {
    method: 'POST',
    path: `${routes.addPoliceUser.post}`,
    options: {
      auth: { scope: [admin] },
      validate: {
        payload: validatePayloadBuilder(confirmFlowValidFields(addRemoveConstants.inputField, ['conflict']))
      },
      pre: [
        addUserPostCheck
      ],
      handler: async (request, h) => {
        throwIfPreConditionError(request)

        appendPoliceUserToAdd(request, request.pre.inputField)

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
        console.log('~~~~~~ Chris Debug ~~~~~~ ', 'PoliceUsers', policeUsers)
        const backlink = routes.addPoliceUser.get
        const model = new AddPoliceUsersListFormViewModel({
          users: policeUsers,
          backlink
        })

        return h.view(views.addPoliceUserList, model)
      }
    }
  }
]
