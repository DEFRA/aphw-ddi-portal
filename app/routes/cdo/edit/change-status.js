const { routes, views } = require('../../../constants/cdo/dog')
const { anyLoggedInUser } = require('../../../auth/permissions.js')
const getUser = require('../../../auth/get-user')
const ViewModel = require('../../../models/cdo/edit/change-status')
const InBreachViewModel = require('../../../models/cdo/edit/in-breach')
const { getCdo } = require('../../../api/ddi-index-api/cdo')
const { updateStatus } = require('../../../api/ddi-index-api/dog')
const { validateChangeStatusPayload, duplicateMicrochipSchema, validateBreachReasonPayload } = require('../../../schema/portal/edit/change-status')
const { addBackNavigation, addBackNavigationForErrorCondition } = require('../../../lib/back-helpers')
const { ApiConflictError } = require('../../../errors/api-conflict-error')
const { getBreachCategories, setDogBreaches } = require('../../../api/ddi-index-api/dog-breaches')

const changeStatusPostFailAction = async (request, h, error) => {
  console.log('~~~~~~ Chris Debug ~~~~~~ changeStatusPostFailAction', '')
  const payload = request.payload

  const cdo = await getCdo(payload.indexNumber, getUser(request))
  if (cdo == null) {
    return h.response().code(404).takeover()
  }

  const backNav = addBackNavigationForErrorCondition(request)

  const model = {
    status: cdo.dog.status,
    indexNumber: cdo.dog.indexNumber,
    newStatus: payload.newStatus
  }

  const viewModel = new ViewModel(model, backNav, error)

  return h.view(views.changeStatus, viewModel).code(400).takeover()
}

const breachReasonPostFailAction = async (request, h, error) => {
  const user = getUser(request)
  const payload = request.payload
  console.log('~~~~~~ Chris Debug ~~~~~~ 3', '')

  const cdo = await getCdo(payload.indexNumber, user)
  if (cdo == null) {
    return h.response().code(404).takeover()
  }
  const breachCategories = await getBreachCategories(user)

  const backNav = addBackNavigationForErrorCondition(request)

  const viewModel = new InBreachViewModel(cdo.dog, breachCategories, payload.dogBreaches ?? [], backNav, error)

  return h.view(views.inBreachCategories, viewModel).code(400).takeover()
}

module.exports = [
  {
    method: 'GET',
    path: `${routes.changeStatus.get}/{indexNumber}`,
    options: {
      auth: { scope: anyLoggedInUser },
      handler: async (request, h) => {
        console.log('~~~~~~ Chris Debug ~~~~~~ in breach', '')
        const user = getUser(request)
        const cdo = await getCdo(request.params.indexNumber, user)

        if (cdo == null) {
          return h.response().code(404).takeover()
        }

        const backNav = addBackNavigation(request, false)

        return h.view(views.changeStatus, new ViewModel(cdo.dog, backNav))
      }
    }
  },
  {
    method: 'POST',
    path: `${routes.changeStatus.post}/{dummy?}`,
    options: {
      auth: { scope: anyLoggedInUser },
      validate: {
        payload: validateChangeStatusPayload,
        failAction: changeStatusPostFailAction
      },
      handler: async (request, h) => {
        console.log('~~~~~~ Chris Debug ~~~~~~ change status', '')
        const payload = request.payload
        const backNav = addBackNavigation(request, false)

        if (payload.newStatus === 'In breach') {
          return h.redirect(`${routes.inBreach.get}/${payload.indexNumber}${backNav?.srcHashParam}`)
        }
        console.log('~~~~~~ Chris Debug ~~~~~~ not in breach', '')

        try {
          await updateStatus(payload, getUser(request))
          return h.redirect(`${routes.changeStatusConfirmation.get}/${payload.indexNumber}`)
        } catch (e) {
          if (e instanceof ApiConflictError) {
            const { error } = duplicateMicrochipSchema.validate(payload)
            return await changeStatusPostFailAction(request, h, error)
          }

          throw e
        }
      }
    }
  },
  {
    method: 'GET',
    path: `${routes.inBreach.get}/{indexNumber}/{dummy?}`,
    options: {
      auth: { scope: anyLoggedInUser },
      handler: async (request, h) => {
        const user = getUser(request)
        const cdo = await getCdo(request.params.indexNumber, user)

        if (cdo == null) {
          return h.response().code(404).takeover()
        }
        const backNav = addBackNavigation(request, false)

        const breachCategories = await getBreachCategories(user)

        return h.view(views.inBreachCategories, new InBreachViewModel(cdo.dog, breachCategories, [], backNav))
      }
    }
  },
  {
    method: 'POST',
    path: `${routes.inBreach.post}/{indexNumber}`,
    options: {
      validate: {
        payload: validateBreachReasonPayload,
        failAction: breachReasonPostFailAction
      },
      auth: { scope: anyLoggedInUser },
      handler: async (request, h) => {
        const payload = request.payload
        console.log('~~~~~~ Chris Debug ~~~~~~ 1', '')

        await setDogBreaches(payload, getUser(request))
        console.log('~~~~~~ Chris Debug ~~~~~~ 2', '')

        return h.redirect(`${routes.changeStatusConfirmation.get}/${payload.indexNumber}`)
      }
    }
  }
]
