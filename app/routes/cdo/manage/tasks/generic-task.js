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
const { logValidationError } = require('../../../../lib/log-helpers')
const { setVerificationPayload, clearVerificationPayload } = require('../../../../session/cdo/manage')
const { useManageCdo } = require('../../../../lib/route-helpers')

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

const sendApplicationPackTaskNames = {
  email: 'email-application-pack',
  post: 'post-application-pack'
}

module.exports = [
  {
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
        const queryParams = request.query

        if (queryParams.clear) {
          clearVerificationPayload(request)
          return h.redirect(`${routes.manageCdoTaskBase.get}/${taskName}/${dogIndex}?src=${queryParams.src}`)
        }

        const user = getUser(request)
        const cdo = await getCdo(dogIndex, user)
        if (!useManageCdo(cdo)) {
          throw new Error(`Dog ${dogIndex} is wrong status for manage-cdo`)
        }

        const data = await getTaskData(dogIndex, taskName, user, request)

        const backNav = addBackNavigation(request)

        addDateComponents(data, 'insuranceRenewal')
        addDateComponents(data, 'applicationFeePaid')
        addDateComponents(data, 'microchipVerification')
        addDateComponents(data, 'neuteringConfirmation')
        addDateComponents(data, 'microchipDeadline')

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
          const user = getUser(request)
          const taskName = request.params.taskName
          logValidationError(error, `${routes.manageCdoTaskBase.get} ${taskName}`)

          const data = await getTaskData(request.params.dogIndex, taskName, user, request, request.payload)

          const backNav = addBackNavigationForErrorCondition(request)

          return h.view(`${views.taskViews}/${taskName}`, createModel(taskName, data, backNav, error)).code(400).takeover()
        }
      },
      handler: async (request, h) => {
        const indexNumber = request.params.dogIndex
        let taskName = request.params.taskName
        const payload = request.payload

        const user = getUser(request)
        const backNav = addBackNavigation(request)

        if (taskName === 'record-verification-dates' && payload.dogNotFitForMicrochip === true) {
          setVerificationPayload(request, payload)
          return h.redirect(`${routes.manageCdoRecordMicrochipDeadline.get}/${indexNumber}${backNav.srcHashParam}`)
        }

        if (taskName === 'send-application-pack') {
          taskName = sendApplicationPackTaskNames[payload.contact]
          const { apiKey } = getTaskDetailsByKey(taskName)
          const data = await saveCdoTaskDetails(indexNumber, apiKey, payload, user)

          return h.view(`${views.taskViews}/${taskName}`, createModel(taskName, { indexNumber, ...data.payload }, backNav))
        }

        const { apiKey } = getTaskDetailsByKey(taskName)

        try {
          await saveCdoTaskDetails(indexNumber, apiKey, payload, user)

          if (taskName === 'record-microchip-deadline') {
            clearVerificationPayload(request)
          }

          return h.redirect(`${routes.manageCdo.get}/${indexNumber}`)
        } catch (e) {
          if (e instanceof ApiErrorFailure) {
            const error = mapBoomError(e, request)

            const data = await getTaskData(request.params.dogIndex, taskName, user, request.payload)

            const backNav = addBackNavigationForErrorCondition(request)

            return h.view(`${views.taskViews}/${taskName}`, createModel(taskName, data, backNav, error)).code(400).takeover()
          }

          throw e
        }
      }
    }
  }
]
