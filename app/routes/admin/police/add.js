const { routes, views, addRemove } = require('../../../constants/admin')
const { admin } = require('../../../auth/permissions')
const FormViewModel = require('../../../models/common/single-submit')
const ConfirmViewModel = require('../../../models/common/confim')
const { validatePayloadBuilder } = require('../../../schema/common/validatePayload')
const {
  isInputFieldInPayload, hasAreYouSureRadioBeenSelected, hasConfirmationFormBeenSubmitted, confirmFlowValidFields,
  duplicateEntrySchema
} = require('../../../schema/portal/common/single-submit')
const { addPoliceForce } = require('../../../api/ddi-index-api/police-forces')
const { getUser } = require('../../../auth')
const { PoliceForceAddedViewModel } = require('../../../models/admin/police/builder')
const { ApiConflictError } = require('../../../errors/api-conflict-error')

const addRemoveConstants = addRemove.policeConstants

const fieldNames = {
  recordTypeText: addRemoveConstants.messageLabel,
  recordType: addRemoveConstants.inputField,
  action: 'add',
  buttonText: `Add ${addRemoveConstants.messageLabel}`
}

const stepOneCheckSubmitted = {
  method: request => {
    const policeForce = validatePayloadBuilder(isInputFieldInPayload(addRemoveConstants.inputField, addRemoveConstants.messageLabelCapital))(request.payload)
    return policeForce.police
  },
  failAction: (_request, h, error) => {
    const backLink = addRemoveConstants.links.index.get

    return h.view(views.addAdminRecord, new FormViewModel({
      backLink,
      ...fieldNames
    }, undefined, error)).code(400).takeover()
  },
  assign: 'inputField'
}

const stepTwoCheckConfirmation = {
  method: request => {
    return validatePayloadBuilder(hasConfirmationFormBeenSubmitted)(request.payload)
  },
  failAction: (request, h) => {
    const recordValue = request.payload[addRemoveConstants.inputField]
    const backLink = addRemoveConstants.links.add.get

    return h.view(views.confirm, new ConfirmViewModel({
      backLink,
      confirmText: `Are you sure you want to add ‘${recordValue}’ to the Index?`,
      nameOrReference: addRemoveConstants.inputField,
      recordValue,
      action: 'add'
    })).code(200).takeover()
  },
  assign: 'confirmPage'
}

const stepThreeCheckConfirmation = {
  method: request => {
    const { confirm } = validatePayloadBuilder(hasAreYouSureRadioBeenSelected)(request.payload)
    return confirm
  },
  assign: 'addConfirmation',
  failAction: (request, h, error) => {
    const recordValue = request.payload[addRemoveConstants.inputField]
    const backLink = routes.addPoliceForce.get

    return h.view(views.confirm, new ConfirmViewModel({
      backLink,
      confirmText: `Are you sure you want to add ‘${recordValue}’ to the Index?`,
      nameOrReference: addRemoveConstants.inputField,
      recordValue,
      action: 'add'
    }, undefined, error)).code(400).takeover()
  }
}

module.exports = [
  {
    method: 'GET',
    path: `${routes.addPoliceForce.get}`,
    options: {
      auth: { scope: [admin] },
      handler: async (_request, h) => {
        const backLink = addRemoveConstants.links.index.get

        return h.view(views.addAdminRecord, new FormViewModel({
          backLink,
          ...fieldNames
        }))
      }
    }
  },
  {
    method: 'POST',
    path: `${routes.addPoliceForce.post}`,
    options: {
      auth: { scope: [admin] },
      validate: {
        payload: validatePayloadBuilder(confirmFlowValidFields(addRemoveConstants.inputField, addRemoveConstants.messageLabel))
      },
      pre: [
        stepOneCheckSubmitted,
        stepTwoCheckConfirmation,
        stepThreeCheckConfirmation
      ],
      handler: async (request, h) => {
        if (!request.pre.addConfirmation) {
          return h.redirect(addRemoveConstants.links.index.get)
        }

        const policeForce = request.pre.inputField

        try {
          const policeForcesResponse = await addPoliceForce({ name: policeForce }, getUser(request))

          return h.view(views.success, PoliceForceAddedViewModel(policeForcesResponse.name))
        } catch (e) {
          if (e instanceof ApiConflictError) {
            const { error } = duplicateEntrySchema(addRemoveConstants.inputField, addRemoveConstants.messageLabel).validate(request.payload)

            const backLink = routes.police.get

            return h.view(views.addAdminRecord, new FormViewModel({
              backLink,
              recordValue: policeForce,
              ...fieldNames
            }, undefined, error)).code(409)
          }
          throw e
        }
      }
    }
  }
]
