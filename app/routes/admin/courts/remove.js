const { routes, views, addRemove } = require('../../../constants/admin')
const { admin } = require('../../../auth/permissions')
const FormViewModel = require('../../../models/common/single-submit-autocomplete')
const ConfirmViewModel = require('../../../models/common/confim')
const { validatePayloadBuilder } = require('../../../schema/common/validatePayload')
const { hasConfirmationFormBeenSubmitted } = require('../../../schema/portal/common/single-submit')
const { isInputFieldPkInPayload, notFoundSchema, confirmFlowValidFields, areYouSureRemoveSchema } = require('../../../schema/portal/common/single-remove')
const { getCourts, removeCourt } = require('../../../api/ddi-index-api/courts')
const { getUser } = require('../../../auth')
const { CourtRemovedViewModel } = require('../../../models/admin/courts/builder')

const addRemoveConstants = addRemove.courtConstants

/**
 * @type {{buttonText: string, recordTypeText: string, recordType: string, action: string}}
 */
const fieldNames = {
  recordTypeText: addRemoveConstants.inputField,
  recordType: addRemoveConstants.inputField,
  action: 'remove',
  buttonText: `Remove ${addRemoveConstants.inputField}`
}

const stepOneCheckSubmitted = {
  method: request => {
    const { pk } = validatePayloadBuilder(isInputFieldPkInPayload(addRemoveConstants.messageLabelCapital))(request.payload)
    return pk
  },
  failAction: async (_request, h, error) => {
    const backLink = addRemoveConstants.backLinks.index.get

    const items = (await getCourts()).map(court => ({
      text: court.name,
      value: court.id
    }))

    return h.view(views.removeAdminRecord, new FormViewModel({
      backLink,
      items,
      ...fieldNames
    }, undefined, error)).code(400).takeover()
  },
  assign: 'inputField'
}

const stepTwoCheckConfirmation = {
  method: request => {
    return validatePayloadBuilder(hasConfirmationFormBeenSubmitted)(request.payload)
  },
  failAction: async (request, h) => {
    const backLink = addRemoveConstants.backLinks.remove.get

    const pk = request.pre.inputField
    const courts = await getCourts()
    const recordValue = courts.find(court => court.id === pk).name

    return h.view(views.confirm, new ConfirmViewModel({
      backLink,
      confirmText: `Are you sure you want to remove ‘${recordValue}’ from the Index?`,
      nameOrReference: addRemoveConstants.inputField,
      recordValue,
      pk,
      action: 'remove'
    })).code(200).takeover()
  },
  assign: 'confirmPage'
}

const stepThreeCheckConfirmation = {
  method: request => {
    return validatePayloadBuilder(areYouSureRemoveSchema('court'))(request.payload)
  },
  assign: 'addConfirmation',
  failAction: async (request, h, error) => {
    const backLink = routes.removeCourt.get

    const pk = request.pre.inputField
    const courts = await getCourts()
    const recordValue = courts.find(court => court.id === pk).name

    return h.view(views.confirm, new ConfirmViewModel({
      backLink,
      confirmText: `Are you sure you want to remove ‘${recordValue}’ from the Index?`,
      nameOrReference: addRemoveConstants.inputField,
      recordValue,
      pk,
      action: 'remove'
    }, undefined, error)).code(400).takeover()
  }
}

module.exports = [
  {
    method: 'GET',
    path: `${routes.courts.remove.get}`,
    options: {
      auth: { scope: [admin] },
      handler: async (_request, h) => {
        const backLink = addRemoveConstants.backLinks.index.get

        const items = (await getCourts()).map(court => ({
          text: court.name,
          value: court.id
        }))

        return h.view(views.removeAdminRecord, new FormViewModel({
          backLink,
          items,
          ...fieldNames
        }))
      }
    }
  },
  {
    method: 'POST',
    path: `${routes.removeCourt.post}`,
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
        if (!request.pre.addConfirmation.confirm) {
          return h.redirect(addRemoveConstants.backLinks.index.get)
        }

        const court = request.pre.addConfirmation.court
        const pk = request.pre.inputField

        try {
          await removeCourt(pk, getUser(request))

          return h.view(views.success, CourtRemovedViewModel(court))
        } catch (e) {
          if (e.isBoom && e.output.statusCode === 404) {
            const { error } = notFoundSchema('pk', court).validate(request.payload)
            const backLink = routes.courts.get

            const items = (await getCourts()).map(court => ({
              text: court.name,
              value: court.id
            }))

            return h.view(views.removeAdminRecord, new FormViewModel({
              backLink,
              recordValue: court,
              items,
              ...fieldNames
            }, undefined, error)).code(404)
          }
          throw e
        }
      }
    }
  }
]
