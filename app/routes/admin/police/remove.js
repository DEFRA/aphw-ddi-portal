const { routes, views, addRemove } = require('../../../constants/admin')
const { admin } = require('../../../auth/permissions')
const FormViewModel = require('../../../models/common/single-submit-autocomplete')
const ConfirmViewModel = require('../../../models/common/confim')
const { validatePayloadBuilder } = require('../../../schema/common/validatePayload')
const { hasConfirmationFormBeenSubmitted } = require('../../../schema/portal/common/single-submit')
const { isInputFieldPkInPayload, notFoundSchema, confirmFlowValidFields, areYouSureRemoveSchema } = require('../../../schema/portal/common/single-remove')
const { getUser } = require('../../../auth')
const { PoliceForceRemovedViewModel } = require('../../../models/admin/police/builder')
const { getPoliceForces } = require('../../../api/ddi-index-api')
const { removePoliceForce } = require('../../../api/ddi-index-api/police-forces')
const { throwIfPreConditionError } = require('../../../lib/route-helpers')

const addRemoveConstants = addRemove.policeConstants

/**
 * @type {{buttonText: string, recordTypeText: string, recordType: string, action: string}}
 */
const fieldNames = {
  recordTypeText: addRemoveConstants.messageLabel,
  recordType: addRemoveConstants.inputField,
  action: 'remove',
  buttonText: `Remove ${addRemoveConstants.messageLabel}`
}

const stepOneCheckSubmitted = {
  method: request => {
    const { pk } = validatePayloadBuilder(isInputFieldPkInPayload(addRemoveConstants.messageLabelCapital))(request.payload)
    return pk
  },
  failAction: async (request, h, error) => {
    const backLink = addRemoveConstants.links.index.get
    const user = getUser(request)

    const items = (await getPoliceForces(user)).map(policeForce => ({
      text: policeForce.name,
      value: policeForce.id
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
    const user = getUser(request)
    throwIfPreConditionError(request)
    const backLink = addRemoveConstants.links.remove.get

    const pk = request.pre.inputField
    const policeForces = await getPoliceForces(user)
    const recordValue = policeForces.find(court => court.id === pk).name

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
    return validatePayloadBuilder(areYouSureRemoveSchema('police'))(request.payload)
  },
  assign: 'addConfirmation',
  failAction: async (request, h, error) => {
    throwIfPreConditionError(request)
    const backLink = routes.removePoliceForce.get

    const pk = request.pre.inputField
    const user = getUser(request)
    const policeForces = await getPoliceForces(user)
    const recordValue = policeForces.find(court => court.id === pk).name

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
    path: `${routes.removePoliceForce.get}`,
    options: {
      auth: { scope: [admin] },
      handler: async (request, h) => {
        const backLink = addRemoveConstants.links.index.get
        const user = getUser(request)

        const items = (await getPoliceForces(user)).map(policeForce => ({
          text: policeForce.name,
          value: policeForce.id
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
    path: `${routes.removePoliceForce.post}`,
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
        throwIfPreConditionError(request)

        if (!request.pre.addConfirmation.confirm) {
          return h.redirect(addRemoveConstants.links.index.get)
        }

        const policeForce = request.pre.addConfirmation.police
        const pk = request.pre.inputField
        const user = getUser(request)

        try {
          await removePoliceForce(pk, user)

          return h.view(views.success, PoliceForceRemovedViewModel(policeForce))
        } catch (e) {
          if (e.isBoom && e.output.statusCode === 404) {
            const { error } = notFoundSchema('pk', policeForce).validate(request.payload)
            const backLink = routes.police.get

            const items = (await getPoliceForces(user)).map(court => ({
              text: court.name,
              value: court.id
            }))

            return h.view(views.removeAdminRecord, new FormViewModel({
              backLink,
              recordValue: policeForce,
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
