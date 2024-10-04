const { routes, views, addRemove } = require('../../../../constants/admin')
const { admin } = require('../../../../auth/permissions')
const FormViewModel = require('../../../../models/common/single-submit')
const { validatePayloadBuilder } = require('../../../../schema/common/validatePayload')
const { confirmFlowValidFields } = require('../../../../schema/portal/common/single-submit')
const { getUser } = require('../../../../auth')
const { submitEmailSchema, submitEmailConflictSchema } = require('../../../../schema/portal/admin/users')
const { getUsers } = require('../../../../api/ddi-index-api/users')

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

const addUserPostCheck = {
  method: async request => {
    validatePayloadBuilder(submitEmailSchema)(request.payload)
    const validatedPayload = validatePayloadBuilder(submitEmailSchema)(request.payload)

    const policeUsers = await getUsers(getUser(request))

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
      handler: async (_request, h) => {
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
        console.log('~~~~~~ Chris Debug ~~~~~~ thus far', '')
        // throwIfPreConditionError(request)
        return h.response().code(200)
        // if (!request.pre.addConfirmation) {
        //   return h.redirect(addRemoveConstants.links.index.get)
        // }
        //
        // const court = request.pre.inputField
        //
        // try {
        //   const courtResponse = await addCourt({ name: court }, getUser(request))
        //
        //   return h.view(views.success, CourtAddedViewModel(courtResponse.name))
        // } catch (e) {
        //   if (e instanceof ApiConflictError) {
        //     const { error } = duplicateEntrySchema(addRemoveConstants.inputField, addRemoveConstants.messageLabel).validate(request.payload)
        //
        //     const backLink = routes.courts.get
        //
        //     return h.view(views.addAdminRecord, new FormViewModel({
        //       backLink,
        //       recordValue: court,
        //       ...fieldNames
        //     }, undefined, error)).code(409)
        //   }
        //   throw e
        // }
      }
    }
  }
]
