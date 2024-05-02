const { routes, views } = require('../../../constants/admin')
const { admin } = require('../../../auth/permissions')
const FormViewModel = require('../../../models/common/single-submit')
const ConfirmViewModel = require('../../../models/common/confim')
const { validatePayloadBuilder } = require('../../../schema/common/validatePayload')
const {
  isInputFieldInPayload, hasAreYouSureRadioBeenSelected, hasConfirmationFormBeenSubmitted, confirmFlowValidFields,
  duplicateEntrySchema
} = require('../../../schema/portal/common/single-submit')
const { addCourt } = require('../../../api/ddi-index-api/courts')
const { getUser } = require('../../../auth')
const { CourtAddedViewModel } = require('../../../models/admin/courts/builder')
const { ApiConflictError } = require('../../../errors/api-conflict-error')

const courtFieldNames = {
  recordTypeText: 'court',
  recordType: 'court',
  action: 'add',
  buttonText: 'Add court'
}

const stepOneCheckCourtSubmitted = {
  method: request => {
    const courtForm = validatePayloadBuilder(isInputFieldInPayload('court', 'Court name'))(request.payload)
    return courtForm.court
  },
  failAction: (_request, h, error) => {
    const backLink = routes.courts.get

    return h.view(views.addAdminRecord, new FormViewModel({
      backLink,
      ...courtFieldNames
    }, undefined, error)).code(400).takeover()
  },
  assign: 'court'
}

const stepTwoCheckConfirmation = {
  method: request => {
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
  assign: 'confirmPage'
}

const stepThreeCheckConfirmation = {
  method: request => {
    const { confirm } = validatePayloadBuilder(hasAreYouSureRadioBeenSelected)(request.payload)
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
      handler: async (_request, h) => {
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
        payload: validatePayloadBuilder(confirmFlowValidFields('court', 'court name'))
      },
      pre: [
        stepOneCheckCourtSubmitted,
        stepTwoCheckConfirmation,
        stepThreeCheckConfirmation
      ],
      handler: async (request, h) => {
        if (!request.pre.addCourtConfirmation) {
          return h.redirect(routes.courts.get)
        }

        const court = request.pre.court

        try {
          const courtResponse = await addCourt({ name: court }, getUser(request))

          return h.view(views.success, CourtAddedViewModel(courtResponse.name))
        } catch (e) {
          if (e instanceof ApiConflictError) {
            const { error } = duplicateEntrySchema('court', 'court name').validate(request.payload)

            const backLink = routes.courts.get

            return h.view(views.addAdminRecord, new FormViewModel({
              backLink,
              recordValue: court,
              ...courtFieldNames
            }, undefined, error)).code(409)
          }
          throw e
        }
      }
    }
  }
]
