const { routes, views } = require('../../../constants/admin')
const { sources, keys } = require('../../../constants/cdo/activity')
const { admin } = require('../../../auth/permissions')
const ViewModel = require('../../../models/common/confim')
const { getActivityById } = require('../../../api/ddi-index-api/activities')
const { validatePayload } = require('../../../schema/portal/common/confirm')
const { deleteActivity } = require('../../../api/ddi-index-api/activities')
const { ActivityRemovedViewModel } = require('../../../models/admin/activities/builder')
const { getUser } = require('../../../auth')
const { notFoundSchema } = require('../../../schema/portal/common/single-remove')

const backLink = routes.activities.index.get

const getActivityConstants = activity => ({
  recordTypeText: 'activity',
  recordType: 'activity',
  action: 'remove',
  buttonText: 'Remove activity',
  confirmReferenceText: activity.label,
  confirmHint: `${activity.activity_source?.name === sources.dog ? 'Dog' : 'Owner'} record: something we ${activity.activity_type?.name === keys.sent ? 'send' : 'receive'}`
})

module.exports = [
  {
    method: 'GET',
    path: `${routes.activities.remove.get}/{activityId}`,
    options: {
      auth: { scope: [admin] },
      handler: async (request, h) => {
        const activity = await getActivityById(request.params.activityId)

        return h.view(views.confirm, new ViewModel({
          ...getActivityConstants(activity),
          backLink
        }))
      }
    }
  },
  {
    method: 'POST',
    path: `${routes.activities.remove.post}/{activityId}`,
    options: {
      auth: { scope: [admin] },
      validate: {
        payload: validatePayload,
        failAction: async (request, h, error) => {
          const activity = await getActivityById(request.params.activityId)

          return h.view(views.confirm, new ViewModel({
            ...getActivityConstants(activity),
            backLink
          }, {}, error)).code(400).takeover()
        }
      },
      handler: async (request, h) => {
        if (request.payload.confirm === 'N') {
          return h.redirect(routes.activities.index.get)
        }

        const activity = await getActivityById(request.params.activityId)

        try {
          await deleteActivity(request.params.activityId, getUser(request))

          return h.view(views.success, ActivityRemovedViewModel(activity))
        } catch (e) {
          if (e.isBoom && e.output.statusCode === 404) {
            const { error } = notFoundSchema('confirm', activity.label).validate(request.payload)
            const backLink = routes.activities.index.get

            return h.view(views.confirm, new ViewModel({
              ...getActivityConstants(activity),
              backLink
            }, undefined, error)).code(404)
          }
          throw e
        }
      }
    }
  }
]
