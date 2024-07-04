const { routes, views } = require('../../../../constants/cdo/index')
const { cdoTasksGetSchema } = require('../../../../schema/portal/cdo/tasks/generic-task')
const { anyLoggedInUser } = require('../../../../auth/permissions')
const getUser = require('../../../../auth/get-user')
const { addDateComponents } = require('../../../../lib/date-helpers')
const { createModel, getTaskData, getValidation, getTaskDetailsByKey } = require('./generic-task-helper')
const { addBackNavigation, addBackNavigationForErrorCondition } = require('../../../../lib/back-helpers')
const { saveCdoTaskDetails, getCdo } = require('../../../../api/ddi-index-api/cdo')
const { ApiErrorFailure } = require('../../../../errors/api-error-failure')
const { microchipValidation } = require('../../../../schema/portal/cdo/dog-details')

const mapBoomError = (e, request) => {
  const { microchipNumber, microchipNumber2 } = request.payload

  const disallowedMicrochipIds = e.boom.payload.microchipNumbers

  const validationPayload = {
    microchipNumber,
    microchipNumber2
  }
  const { error } = microchipValidation(disallowedMicrochipIds).validate(validationPayload, { abortEarly: false })
  return error
}

module.exports = [{
  method: 'GET',
  path: `${routes.manageCdoTaskBase.get}/{taskName}/{dogIndex?}`,
  options: {
    auth: { scope: anyLoggedInUser },
    validate: {
      params: cdoTasksGetSchema
    },
    handler: async (request, h) => {
      const taskName = request.params.taskName
      const dogIndex = request.params.dogIndex

      const cdo = await getCdo(dogIndex)
      if (cdo?.dog?.status !== 'Pre-exempt') {
        throw new Error(`Dog ${dogIndex} is wrong status for manage-cdo`)
      }

      const data = await getTaskData(dogIndex, taskName)

      const backNav = addBackNavigation(request)

      addDateComponents(data, 'insuranceRenewal')
      addDateComponents(data, 'applicationFeePaid')

      return h.view(`${views.taskViews}/${taskName}`, createModel(taskName, data, backNav))
    }
  }
},
{
  method: 'POST',
  path: `${routes.manageCdoTaskBase.get}/{taskName}/{dogIndex?}`,
  options: {
    auth: { scope: anyLoggedInUser },
    validate: {
      options: {
        abortEarly: false
      },
      params: cdoTasksGetSchema,
      payload: function (payload) {
        return getValidation(payload)
      },
      failAction: async (request, h, error) => {
        const taskName = request.params.taskName

        console.log(`Validation error in task ${taskName}:`, error)

        const data = await getTaskData(request.params.dogIndex, taskName, request.payload)

        const backNav = addBackNavigationForErrorCondition(request)

        return h.view(`${views.taskViews}/${taskName}`, createModel(taskName, data, backNav, error)).code(400).takeover()
      }
    },
    handler: async (request, h) => {
      const dogIndex = request.params.dogIndex
      const taskName = request.params.taskName
      const payload = request.payload

      const { apiKey } = getTaskDetailsByKey(taskName)

      try {
        await saveCdoTaskDetails(dogIndex, apiKey, payload, getUser(request))

        return h.redirect(`${routes.manageCdo.get}/${dogIndex}`)
      } catch (e) {
        if (e instanceof ApiErrorFailure) {
          const error = mapBoomError(e, request)

          const data = await getTaskData(request.params.dogIndex, taskName, request.payload)

          const backNav = addBackNavigationForErrorCondition(request)

          return h.view(`${views.taskViews}/${taskName}`, createModel(taskName, data, backNav, error)).code(400).takeover()
        }

        throw e
      }
    }
  }
}]
