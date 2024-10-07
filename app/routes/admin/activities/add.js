const { routes, views, addRemove } = require('../../../constants/admin')
const { admin } = require('../../../auth/permissions')
const FormViewModel = require('../../../models/common/single-submit')
const ConfirmViewModel = require('../../../models/common/confim')
const { sources, keys } = require('../../../constants/cdo/activity')
const { getUser } = require('../../../auth')
const { addActivity } = require('../../../api/ddi-index-api/activities')
const { validatePayloadBuilder } = require('../../../schema/common/validatePayload')
const {
  isInputFieldInPayload, hasAreYouSureRadioBeenSelected, hasConfirmationFormBeenSubmitted, confirmFlowValidFields,
  duplicateEntrySchema
} = require('../../../schema/portal/common/single-submit')
const { ApiConflictError } = require('../../../errors/api-conflict-error')
const { ActivityAddedViewModel } = require('../../../models/admin/activities/builder')
const { throwIfPreConditionError } = require('../../../lib/route-helpers')

const backLink = routes.activities.index.get

const addRemoveConstants = addRemove.activityConstants

const fieldNames = {
  recordTypeText: addRemoveConstants.inputField,
  recordType: addRemoveConstants.inputField,
  action: 'add',
  buttonText: `Add ${addRemoveConstants.inputField}`
}

const hintText = {
  sent: 'For example, change of address form, death of a dog form.',
  received: 'For example, application pack, police correspondence.'
}
const getConfirmHint = request => {
  return `${request.params.activitySource === sources.dog ? 'Dog' : 'Owner'} record: something we ${request.params.activityType === keys.sent ? 'send' : 'receive'}`
}

const stepOneCheckSubmitted = {
  method: request => {
    const activityForm = validatePayloadBuilder(isInputFieldInPayload(addRemoveConstants.inputField, addRemoveConstants.messageLabelCapital))(request.payload)
    return activityForm.activity
  },
  failAction: (request, h, error) => {
    const backLink = addRemoveConstants.links.index.get

    return h.view(views.addAdminRecord, new FormViewModel({
      optionText: 'What activity do you want to add?',
      hint: {
        text: hintText[request.params.activityType]
      },
      backLink,
      confirmHint: getConfirmHint(request),
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
    throwIfPreConditionError(request)
    const recordValue = request.payload[addRemoveConstants.inputField]
    const backLink = `${addRemoveConstants.links.add.get}/${request.params.activityType}/${request.params.activitySource}`

    return h.view(views.confirm, new ConfirmViewModel({
      backLink,
      confirmText: `Are you sure you want to add ‘${recordValue}’ to the activity list?`,
      confirmHint: getConfirmHint(request),
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
    throwIfPreConditionError(request)

    const recordValue = request.payload[addRemoveConstants.inputField]
    const backLink = `${addRemoveConstants.links.add.get}/${request.params.activityType}/${request.params.activitySource}`

    return h.view(views.confirm, new ConfirmViewModel({
      backLink,
      confirmText: `Are you sure you want to add ‘${recordValue}’ to the activity list?`,
      confirmHint: getConfirmHint(request),
      nameOrReference: addRemoveConstants.inputField,
      recordValue,
      action: 'add'
    }, undefined, error)).code(400).takeover()
  }
}

module.exports = [
  {
    method: 'GET',
    path: `${routes.activities.add.get}/{activityType}/{activitySource}`,
    options: {
      auth: { scope: [admin] },
      handler: async (request, h) => {
        return h.view(views.addAdminRecord, new FormViewModel({
          optionText: 'What activity do you want to add?',
          hint: {
            text: hintText[request.params.activityType]
          },
          confirmHint: getConfirmHint(request),
          backLink,
          ...fieldNames
        }))
      }
    }
  },
  {
    method: 'POST',
    path: `${routes.activities.add.post}/{activityType}/{activitySource}`,
    options: {
      auth: { scope: [admin] },
      validate: {
        payload: validatePayloadBuilder(confirmFlowValidFields(addRemoveConstants.inputField))
      },
      pre: [
        stepOneCheckSubmitted,
        stepTwoCheckConfirmation,
        stepThreeCheckConfirmation
      ],
      handler: async (request, h) => {
        throwIfPreConditionError(request)

        if (!request.pre.addConfirmation) {
          return h.redirect(addRemoveConstants.links.index.get)
        }

        const label = request.pre.inputField

        try {
          const activityResponse = await addActivity({
            label,
            activityType: request.params.activityType,
            activitySource: request.params.activitySource
          }, getUser(request))

          return h.view(views.success, ActivityAddedViewModel(activityResponse))
        } catch (e) {
          if (e instanceof ApiConflictError) {
            const { error } = duplicateEntrySchema(addRemoveConstants.inputField, addRemoveConstants.messageLabel).validate(request.payload)

            const backLink = routes.activities.index.get

            return h.view(views.addAdminRecord, new FormViewModel({
              backLink,
              recordValue: label,
              ...fieldNames
            }, undefined, error)).code(409)
          }
          throw e
        }
      }
    }
  }
]
