const { routes, views } = require('../../../constants/admin')
const { admin } = require('../../../auth/permissions')
const FormViewModel = require('../../../models/common/single-submit')
const ConfirmViewModel = require('../../../models/common/confim')
const { validatePayloadBuilder } = require('../../../schema/common/validatePayload')
const { isInputFieldInPayload, hasAreYouSureRadioBeenSelected, hasConfirmationFormBeenSubmitted, confirmFlowValidFields } = require('../../../schema/portal/common/single-submit')

const courtFieldNames = {
  recordTypeText: 'court',
  recordType: 'court',
  action: 'add',
  buttonText: 'Add court'
}

const stepOneCheckCourtSubmited = {
  method: (request, h) => {
    return validatePayloadBuilder(isInputFieldInPayload('court', 'Court name'))(request.payload)
  },
  failAction: (request, h, error) => {
    const backLink = routes.courts.get

    return h.view(views.addAdminRecord, new FormViewModel({
      backLink,
      ...courtFieldNames
    }, undefined, error)).code(400).takeover()
  },
  assign: 'courtForm'
}

const stepTwoCheckConfirmation = {
  method: (request, h) => {
    return validatePayloadBuilder(hasConfirmationFormBeenSubmitted)(request.payload)
  },
  failAction: (request, h, err) => {
    const courtName = request.payload.court
    const backLink = routes.addCourt.get

    return h.view(views.confirm, new ConfirmViewModel({
      backLink,
      confirmText: `Are you sure you want to add ‘${courtName}’ to the Index?`,
      nameOrReference: 'court',
      recordValue: courtName,
      action: 'add'
    })).code(200).takeover()
  },
  assign: 'confirmForm'
}

const stepThreeCheckConfirmation = {
  method: (request, h) => {
    const { confirm } = validatePayloadBuilder(hasAreYouSureRadioBeenSelected('court'))(request.payload)
    return confirm
  },
  assign: 'addCourtConfirmation',
  failAction: (request, h, error) => {
    const courtName = request.payload.court
    const backLink = routes.addCourt.get

    return h.view(views.confirm, new ConfirmViewModel({
      backLink,
      confirmText: `Are you sure you want to add ‘${courtName}’ to the Index?`,
      nameOrReference: 'court',
      recordValue: courtName,
      action: 'add'
    }, undefined, error)).code(400).takeover()
  }
}

module.exports = [
  {
    method: 'GET',
    path: `${routes.addCourt.get}`,
    options: {
      auth: { scope: [admin] },
      handler: async (request, h) => {
        const backLink = routes.courts.get

        return h.view(views.addAdminRecord, new FormViewModel({
          backLink,
          ...courtFieldNames
        }))
      }
    }
  },
  {
    method: 'POST',
    path: `${routes.addCourt.post}`,
    options: {
      auth: { scope: [admin] },
      validate: {
        payload: validatePayloadBuilder(confirmFlowValidFields('court'))
      },
      pre: [
        stepOneCheckCourtSubmited,
        stepTwoCheckConfirmation,
        stepThreeCheckConfirmation
      ],
      handler: async (request, h) => {
        if (!request.pre.addCourtConfirmation) {
          return h.redirect(routes.courts.get)
        }
        return h.response().code(501).takeover()
      }
    }
  }
]
