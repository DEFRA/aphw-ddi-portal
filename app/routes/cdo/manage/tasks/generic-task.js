const { routes, views } = require('../../../../constants/cdo/index')
const { cdoTasksGetSchema } = require('../../../../schema/portal/cdo/tasks/generic-task')
const { anyLoggedInUser } = require('../../../../auth/permissions')
const getUser = require('../../../../auth/get-user')
const { createModel, getTaskData, getValidation, getTaskPayloadData } = require('./generic-task-helper')
const { addBackNavigation, addBackNavigationForErrorCondition } = require('../../../../lib/back-helpers')
const { saveCdoTaskDetails } = require('../../../../api/ddi-index-api/cdo')

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

      const data = await getTaskData(dogIndex, taskName)

      const backNav = addBackNavigation(request)

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

        const data = await getTaskPayloadData(request.params.dogIndex, taskName, request.payload)

        const backNav = addBackNavigationForErrorCondition(request)

        return h.view(`${views.taskViews}/${taskName}`, createModel(taskName, data, backNav, error)).code(400).takeover()
      }
    },
    handler: async (request, h) => {
      const dogIndex = request.params.dogIndex
      const taskName = request.params.taskName

      await saveCdoTaskDetails(dogIndex, taskName, request.payload, getUser(request))

      return h.redirect(`${routes.manageCdo.get}/${dogIndex}`)
    }
  }
}]
