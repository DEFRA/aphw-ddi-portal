const { routes, views } = require('../../constants/admin')
const { admin } = require('../../auth/permissions')
const ViewModel = require('../../models/admin/insurance')
const { getUser } = require('../../auth')
const { ApiConflictError } = require('../../errors/api-conflict-error')
const { getCompanies } = require('../../api/ddi-index-api')
const { validateInsurancePayload, duplicateInsuranceCompanySchema, removeSchema } = require('../../schema/portal/admin/insurance')
const { removeInsuranceCompany, addInsuranceCompany, getCompaniesNewest } = require('../../api/ddi-index-api/insurance')

module.exports = [
  {
    method: 'GET',
    path: `${routes.insurance.get}`,
    options: {
      auth: { scope: [admin] },
      handler: async (request, h) => {
        const user = getUser(request)
        const insuranceCompanies = await getCompanies(user)
        return h.view(views.insurance, new ViewModel({}, insuranceCompanies))
      }
    }
  },
  {
    method: 'POST',
    path: `${routes.insurance.post}`,
    options: {
      auth: { scope: [admin] },
      validate: {
        options: {
          abortEarly: false
        },
        payload: async function (payload) {
          if (payload.remove) {
            return {
              remove: payload.remove
            }
          }

          return validateInsurancePayload(payload)
        },
        failAction: async (request, h, error) => {
          const user = getUser(request)
          const insuranceCompanies = await getCompanies(user)

          return h.view(views.insurance, new ViewModel(request.payload, insuranceCompanies, error)).code(400).takeover()
        }
      },
      handler: async (request, h) => {
        const actioningUser = getUser(request)
        let requestPayload = request.payload
        let insuranceCompanies = []

        if (request.payload.remove) {
          const { value, error } = removeSchema.validate(request.payload)

          if (error) {
            throw new Error('Invalid request')
          }
          await removeInsuranceCompany(value.remove, actioningUser)

          insuranceCompanies = await getCompanies(actioningUser)
        } else {
          const payload = {
            name: requestPayload.name
          }

          try {
            await addInsuranceCompany(payload, actioningUser)
            requestPayload = {}
          } catch (e) {
            if (e instanceof ApiConflictError) {
              const { error } = duplicateInsuranceCompanySchema.validate(payload, { abortEarly: false })

              const insuranceCompanies = await getCompanies(actioningUser)

              return h.view(views.insurance, new ViewModel(requestPayload, insuranceCompanies, error)).code(400)
            }

            throw e
          }

          insuranceCompanies = await getCompaniesNewest(actioningUser)
        }

        return h.view(views.insurance, new ViewModel(requestPayload, insuranceCompanies))
      }
    }
  }
]
