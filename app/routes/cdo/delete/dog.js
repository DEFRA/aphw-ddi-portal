const { routes, views } = require('../../../constants/cdo/dog')
const { admin } = require('../../../auth/permissions')
const ViewModel = require('../../../models/common/confim')
const DeletedViewModel = require('../../../models/cdo/delete/deleted')
const ConfirmOwnerDeleteViewModel = require('../../../models/cdo/delete/confimDogAndOwner')
const { addBackNavigation, addBackNavigationForErrorCondition, extractBackNavParam, getBackLinkToSamePage } = require('../../../lib/back-helpers')
const { getDogDetails, deleteDog, getDogOwnerWithDogs } = require('../../../api/ddi-index-api/dog')
const { validatePayload, confirmOwnerRadioSchema, bypassSchemaForDeleteOnlyDog, completeOwnerSchema, isSingleDogSchema } = require('../../../schema/portal/cdo/confirmDogDelete')
const { getUser } = require('../../../auth')
const { deletePerson, getPersonByReference } = require('../../../api/ddi-index-api/person')
const { validatePayloadBuilder } = require('../../../schema/common/validatePayload')
const { throwIfPreConditionError } = require('../../../lib/route-helpers')

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

    const backLink = getBackLinkToSamePage(request)

    const user = getUser(request)
    const dogOwner = await getPersonByReference(ownerPk, user)

    return h.view(views.confirmDogAndOwner, new ConfirmOwnerDeleteViewModel({
      firstName: dogOwner.firstName,
      lastName: dogOwner.lastName,
      ownerPk: ownerPk,
      pk: pk,
      backLink
    })).code(200).takeover()
  },
  assign: 'dogAndOwnerConfirmation'
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
    throwIfPreConditionError(request)
    const pk = request.payload.pk
    const ownerPk = request.payload.ownerPk

    const backLink = getBackLinkToSamePage(request)

    const user = getUser(request)
    const dogOwner = await getPersonByReference(ownerPk, user)

    return h.view(views.confirmDogAndOwner, new ConfirmOwnerDeleteViewModel({
      firstName: dogOwner.firstName,
      lastName: dogOwner.lastName,
      ownerPk: ownerPk,
      pk: pk,
      backLink
    }, undefined, error)).code(400).takeover()
  },
  assign: 'dogAndOwnerRadioValidation'
}

module.exports = [
  {
    method: 'GET',
    path: `${routes.deleteDog.get}/{indexNumber?}`,
    options: {
      auth: { scope: [admin] },
      handler: async (request, h) => {
        const indexNumber = request.params.indexNumber

        const user = getUser(request)
        const details = await buildDetails(indexNumber, user)
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
          const user = getUser(request)
          const details = await buildDetails(request.params.indexNumber, user)

          const backNav = addBackNavigationForErrorCondition(request)

          return h.view(views.confirmDeleteGeneric, new ViewModel(details, backNav, error)).code(400).takeover()
        }
      },
      pre: [
        dogAndOwnerConfirmation,
        dogAndOwnerRadioValidation
      ],
      handler: async (request, h) => {
        throwIfPreConditionError(request)

        const payload = request.payload
        const pk = request.params.indexNumber
        const ownerPk = payload.ownerPk

        if (payload.confirm === 'N') {
          return h.redirect(`${routes.viewDogDetails.get}/${pk}${extractBackNavParam(request)}`)
        }

        const user = getUser(request)

        let details = await buildDetails(pk, user)
        await deleteDog(pk, user)

        const backNav = addBackNavigation(request)

        if (payload.confirmOwner === 'Y' && ownerPk) {
          details = await buildDetailsOwner(pk, ownerPk, user)

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
 * @param user
 * @returns {Promise<ConfirmDetailsDogAndOwner>}
 */
const buildDetails = async (pk, user) => {
  // check if dog exists
  await getDogDetails(pk, user)

  const ownerPkValue = {}
  const dogOwner = await getDogOwnerWithDogs(pk, user)

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
 * @param user
 * @returns {Promise<DeletedDetails>}
 */
const buildDetailsOwner = async (pk, ownerPk, user) => {
  const dogOwner = await getPersonByReference(ownerPk, user)

  return {
    pk,
    nameOrReference: `${pk}`,
    nameOrReferenceText: `Dog ${pk} and ${dogOwner.firstName} ${dogOwner.lastName}`
  }
}
