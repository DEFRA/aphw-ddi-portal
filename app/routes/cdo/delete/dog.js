const { routes, views } = require('../../../constants/cdo/dog')
const { admin } = require('../../../auth/permissions')
const ViewModel = require('../../../models/common/confim')
const DeletedViewModel = require('../../../models/cdo/delete/deleted')
const ConfirmOwnerDeleteViewModel = require('../../../models/cdo/delete/confimDogAndOwner')
const { addBackNavigation, addBackNavigationForErrorCondition, extractBackNavParam } = require('../../../lib/back-helpers')
const { getDogDetails, deleteDog, getDogOwnerWithDogs } = require('../../../api/ddi-index-api/dog')
const { validatePayload, confirmOwnerRadioSchema, bypassSchemaForDeleteOnlyDog, completeOwnerSchema, isSingleDogSchema } = require('../../../schema/portal/cdo/confirmDogDelete')
const { getUser } = require('../../../auth')
const { deletePerson, getPersonByReference } = require('../../../api/ddi-index-api/person')
const { validatePayloadBuilder } = require('../../../schema/common/validatePayload')

const dogAndOwnerConfirmation = {
  method: request => {
    const { pk } = validatePayloadBuilder(bypassSchemaForDeleteOnlyDog(confirmOwnerRadioSchema))(request.payload)
    return pk
  },
  failAction: async (request, h, error) => {
    const pk = request.payload.pk
    const ownerPk = request.payload.ownerPk

    if (request.payload.confirm === 'N') {
      return h.redirect(`${routes.viewDogDetails.get}/${pk}${extractBackNavParam(request)}`).takeover()
    }

    const backLink = `${routes.deleteDog.get}/${pk}`
    const dogOwner = await getPersonByReference(ownerPk)

    return h.view(views.confirmDogAndOwner, new ConfirmOwnerDeleteViewModel({
      firstName: dogOwner.firstName,
      lastName: dogOwner.lastName,
      ownerPk: ownerPk,
      pk: pk,
      backLink
    })).code(200).takeover()
  },
  assign: 'dogPk'
}

const dogAndOwnerRadioValidation = {
  method: request => {
    const { value, error } = isSingleDogSchema.validate(request.payload)

    if (error) {
      const { pk } = validatePayloadBuilder(completeOwnerSchema)(request.payload)
      return pk
    } else {
      return value.pk
    }
  },
  failAction: async (request, h, error) => {
    const pk = request.payload.pk
    const ownerPk = request.payload.ownerPk

    const backLink = `${routes.deleteDog.get}/${pk}`
    const dogOwner = await getPersonByReference(ownerPk)

    return h.view(views.confirmDogAndOwner, new ConfirmOwnerDeleteViewModel({
      firstName: dogOwner.firstName,
      lastName: dogOwner.lastName,
      ownerPk: ownerPk,
      pk: pk,
      backLink
    }, undefined, error)).code(400).takeover()
  },
  assign: 'dogPk'
}

module.exports = [
  {
    method: 'GET',
    path: `${routes.deleteDog.get}/{indexNumber?}`,
    options: {
      auth: { scope: [admin] },
      handler: async (request, h) => {
        const indexNumber = request.params.indexNumber

        const details = await buildDetails(indexNumber)
        const backNav = addBackNavigation(request)

        return h.view(views.confirmDeleteGeneric, new ViewModel(details, backNav))
      }
    }
  },
  {
    method: 'POST',
    path: `${routes.deleteDog.post}/{indexNumber?}`,
    options: {
      auth: { scope: [admin] },
      validate: {
        payload: validatePayload,
        failAction: async (request, h, error) => {
          const details = await buildDetails(request.params.indexNumber)

          const backNav = addBackNavigationForErrorCondition(request)

          return h.view(views.confirmDeleteGeneric, new ViewModel(details, backNav, error)).code(400).takeover()
        }
      },
      pre: [
        dogAndOwnerConfirmation,
        dogAndOwnerRadioValidation
      ],
      handler: async (request, h) => {
        const payload = request.payload
        const pk = request.params.indexNumber
        const ownerPk = payload.ownerPk

        if (payload.confirm === 'N') {
          return h.redirect(`${routes.viewDogDetails.get}/${pk}${extractBackNavParam(request)}`)
        }

        const user = getUser(request)

        let details = await buildDetails(pk)
        await deleteDog(pk, user)

        const backNav = addBackNavigation(request)

        if (payload.confirmOwner === 'Y' && ownerPk) {
          details = await buildDetailsOwner(pk, ownerPk)

          await deletePerson(ownerPk, user)
          return h.view(views.deleteDogAndOwner, new DeletedViewModel(details, backNav))
        }

        return h.view(views.deleteGeneric, new DeletedViewModel({
          nameOrReferenceText: `Dog ${pk}`,
          pk,
          nameOrReference: pk
        }, backNav))
      }
    }
  }
]

/**
 * @param pk
 * @returns {Promise<ConfirmDetailsDogAndOwner>}
 */
const buildDetails = async (pk) => {
  // check if dog exists
  await getDogDetails(pk)

  const ownerPkValue = {}
  const dogOwner = await getDogOwnerWithDogs(pk)

  if (dogOwner.dogs.length === 1) {
    ownerPkValue.inputReference = 'ownerPk'
    ownerPkValue.recordValue = dogOwner.personReference
  }

  return {
    action: 'delete',
    pk,
    recordTypeText: 'dog',
    nameOrReference: `${pk}`,
    confirmReferenceText: `${pk}`,
    nameOrReferenceText: `Dog ${pk}`,
    ...ownerPkValue
  }
}

/**
 * @param pk
 * @param ownerPk
 * @returns {Promise<DeletedDetails>}
 */
const buildDetailsOwner = async (pk, ownerPk) => {
  const dogOwner = await getPersonByReference(ownerPk)

  return {
    pk,
    nameOrReference: `${pk}`,
    nameOrReferenceText: `Dog ${pk} and ${dogOwner.firstName} ${dogOwner.lastName}`
  }
}
