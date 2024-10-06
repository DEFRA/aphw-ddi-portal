const { routes, views, addRemove } = require('../../../../constants/admin')
const { admin } = require('../../../../auth/permissions')
const FormViewModel = require('../../../../models/common/single-submit-autocomplete')
const ConfirmViewModel = require('../../../../models/common/confim')
const { validatePayloadBuilder } = require('../../../../schema/common/validatePayload')
const { hasConfirmationFormBeenSubmitted } = require('../../../../schema/portal/common/single-submit')
const { isInputFieldPkInPayload, notFoundSchema, confirmFlowValidFields, areYouSureRemoveSchema } = require('../../../../schema/portal/common/single-remove')
const { getUser } = require('../../../../auth')
const { PoliceUserRemovedViewModel } = require('../../../../models/admin/courts/builder')
const { throwIfPreConditionError } = require('../../../../lib/route-helpers')
const { getUsers, removeUser } = require('../../../../api/ddi-index-api/users')

const addRemoveConstants = addRemove.policeUserConstants
const mainField = addRemoveConstants.inputField
/**
 * @type {{buttonText: string, recordTypeText: string, recordType: string, action: string}}
 */
const fieldNames = {
  recordTypeText: addRemoveConstants.single,
  recordType: addRemoveConstants.inputField,
  action: 'remove',
  buttonText: `Remove ${addRemoveConstants.single}`
}

const stepOneCheckSubmitted = {
  method: request => {
    const { pk } = validatePayloadBuilder(isInputFieldPkInPayload(addRemoveConstants.messageLabelCapital))(request.payload)
    return pk
  },
  failAction: async (request, h, error) => {
    const user = getUser(request)
    const backLink = addRemoveConstants.links.index.get

    const items = (await getUsers(user)).map(policeUser => ({
      text: policeUser.username,
      value: policeUser.id
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
    throwIfPreConditionError(request)
    const user = getUser(request)
    const backLink = addRemoveConstants.links.remove.get

    const pk = request.pre.inputField
    const policeUsers = await getUsers(user)
    const recordValue = policeUsers.find(policeUser => policeUser.id === pk).username

    return h.view(views.confirm, new ConfirmViewModel({
      backLink,
      confirmText: `Are you sure you want to remove ${recordValue} from the Index?`,
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
    return validatePayloadBuilder(areYouSureRemoveSchema(mainField))(request.payload)
  },
  assign: 'addConfirmation',
  failAction: async (request, h, error) => {
    throwIfPreConditionError(request)
    const user = getUser(request)
    const backLink = routes.removePoliceUser.get

    const pk = request.pre.inputField
    const policeUsers = await getUsers(user)
    const recordValue = policeUsers.find(policeUser => policeUser.id === pk).username

    return h.view(views.confirm, new ConfirmViewModel({
      backLink,
      confirmText: `Are you sure you want to remove ${recordValue} from the Index?`,
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
    path: `${routes.removePoliceUser.get}`,
    options: {
      auth: { scope: [admin] },
      handler: async (request, h) => {
        const backLink = addRemoveConstants.links.index.get
        const user = getUser(request)

        const items = (await getUsers(user)).map(policeUser => ({
          text: policeUser.username,
          value: policeUser.id
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
    path: `${routes.removePoliceUser.post}`,
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
        const user = getUser(request)

        if (!request.pre.addConfirmation.confirm) {
          return h.redirect(addRemoveConstants.links.index.get)
        }

        const policeUser = request.pre.addConfirmation.policeUser
        const pk = request.pre.inputField

        try {
          await removeUser(pk, user)

          return h.view(views.success, PoliceUserRemovedViewModel(policeUser))
        } catch (e) {
          if (e.isBoom && e.output.statusCode === 404) {
            const { error } = notFoundSchema('pk', policeUser).validate(request.payload)
            const backLink = routes.policeUsers.get

            const items = (await getUsers(user)).map(policeUser => ({
              text: policeUser.username,
              value: policeUser.id
            }))

            return h.view(views.removeAdminRecord, new FormViewModel({
              backLink,
              recordValue: policeUser,
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
