const { auth, user } = require('../../../../../mocks/auth')
const FormData = require('form-data')
jest.mock('../../../../../../app/session/session-wrapper')
const { setInSession } = require('../../../../../../app/session/session-wrapper')
const { JSDOM } = require('jsdom')
const { buildSummaryCdoResponse, buildCdoCounts } = require('../../../../../mocks/cdo/cdos')
jest.mock('../../../../../../app/api/ddi-index-api/search')

describe('Manage Live Cdos test', () => {
  jest.mock('../../../../../../app/auth')
  const mockAuth = require('../../../../../../app/auth')

  jest.mock('../../../../../../app/api/ddi-index-api/cdos')
  const { getLiveCdos, getLiveCdosWithinMonth, getInterimExemptions, getExpiredCdos } = require('../../../../../../app/api/ddi-index-api/cdos')

  const createServer = require('../../../../../../app/server')
  let server

  setInSession.mockReturnValue()

  beforeEach(async () => {
    mockAuth.getUser.mockReturnValue(user)
    server = await createServer()
    await server.initialize()
  })

  test('GET /cdo/manage route returns 200', async () => {
    getLiveCdos.mockResolvedValue(buildSummaryCdoResponse({
      cdos: [
        {
          id: 20001,
          index: 'ED20001',
          status: 'Pre-exempt',
          owner: 'Scott Pilgrim',
          personReference: 'P-A133-7E4C',
          cdoExpiry: new Date('2024-04-19'),
          humanReadableCdoExpiry: '19 April 2024',
          joinedExemptionScheme: null,
          policeForce: 'Cheshire Constabulary'
        },
        {
          id: 20002,
          index: 'ED20002',
          status: 'Pre-exempt ',
          owner: 'Ramona Flowers ',
          personReference: 'P-A133-7E5C',
          cdoExpiry: new Date('2024-04-20'),
          humanReadableCdoExpiry: '20 April 2024',
          joinedExemptionScheme: null,
          policeForce: null
        }
      ],
      counts: buildCdoCounts({ total: 2, within30: 1, nonComplianceLetterNotSent: 4 })
    }))

    const options = {
      method: 'GET',
      url: '/cdo/manage',
      auth
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(200)
    expect(getLiveCdos).toHaveBeenCalledWith(user, {
      column: 'cdoExpiry',
      order: 'ASC'
    })
    const { document } = (new JSDOM(response.payload)).window
    expect(document.querySelector('h1.govuk-heading-l').textContent.trim()).toBe('Manage CDOs')
    expect(document.querySelector('ul[data-testid="tab-navigation"]')).not.toBeNull()
    const LIVE_CDO_TEXT = 'Live CDOs (2)'
    expect(document.querySelectorAll('.govuk-tabs__list-item')[0].textContent.trim()).toBe(LIVE_CDO_TEXT)
    expect(document.querySelectorAll('.govuk-tabs__list-item')[1].textContent.trim()).toBe('Expired CDOs (4)')
    expect(document.querySelectorAll('.govuk-tabs__list-item')[2].textContent.trim()).toBe('CDOs due within 30 days (1)')
    expect(document.querySelectorAll('.govuk-tabs__list-item--selected')[0].textContent.trim()).toBe(LIVE_CDO_TEXT)
    expect(document.querySelectorAll('.govuk-tabs__list-item--selected').length).toBe(1)
    expect(document.querySelector('.govuk-table')).not.toBeNull()
    expect(document.querySelector('.govuk-button--secondary').textContent.trim()).toBe('Interim exemptions')
    expect(document.querySelector('.govuk-button--secondary').getAttribute('href')).toBe('/cdo/manage/interim')
    expect(document.querySelectorAll('.govuk-table thead th')[0].textContent.trim()).toBe('CDO expiry')
    expect(document.querySelectorAll('.govuk-table thead th')[0].getAttribute('data-aria-sort')).toBe('ascending')
    expect(document.querySelectorAll('.govuk-table thead th a')[0].getAttribute('href')).toBe('/cdo/manage?sortOrder=DESC')
    expect(document.querySelectorAll('.govuk-table thead th')[1].textContent.trim()).toBe('Index number')
    expect(document.querySelectorAll('.govuk-table thead th')[1].getAttribute('data-aria-sort')).toBe('none')
    expect(document.querySelectorAll('.govuk-table thead th a')[1].getAttribute('href')).toBe('/cdo/manage?sortKey=indexNumber')
    expect(document.querySelectorAll('.govuk-table thead th')[2].textContent.trim()).toBe('Owner')
    expect(document.querySelectorAll('.govuk-table thead th')[2].getAttribute('data-aria-sort')).toBe('none')
    expect(document.querySelectorAll('.govuk-table thead th a')[2].getAttribute('href')).toBe('/cdo/manage?sortKey=owner')
    expect(document.querySelectorAll('.govuk-table thead th')[3].textContent.trim()).toBe('Police force')
    expect(document.querySelectorAll('.govuk-table thead th')[3].getAttribute('data-aria-sort')).toBe('none')
    expect(document.querySelectorAll('.govuk-table thead th a')[3].getAttribute('href')).toBe('/cdo/manage?sortKey=policeForce')

    const cols = document.querySelectorAll('.govuk-table .govuk-table__row td')

    expect(cols[0].textContent.trim()).toBe('19 April 2024')
    expect(cols[1].textContent.trim()).toBe('ED20001')
    expect(cols[2].textContent.trim()).toBe('Scott Pilgrim')
    expect(cols[3].textContent.trim()).toBe('Cheshire Constabulary')
    expect(cols[7].textContent.trim()).toBe('Not entered')
  })

  test('GET /cdo/manage?sortOrder=DESC route returns 200', async () => {
    getLiveCdos.mockResolvedValue(buildSummaryCdoResponse({}))

    const options = {
      method: 'GET',
      url: '/cdo/manage?sortOrder=DESC',
      auth
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(200)

    const { document } = (new JSDOM(response.payload)).window

    expect(document.querySelectorAll('.govuk-table thead th a')[0].getAttribute('href')).toBe('/cdo/manage')
    expect(document.querySelectorAll('.govuk-table thead th')[0].getAttribute('data-aria-sort')).toBe('descending')
  })

  test('GET /cdo/manage?sortKey=owner route returns 200', async () => {
    getLiveCdos.mockResolvedValue(buildSummaryCdoResponse({}))

    const options = {
      method: 'GET',
      url: '/cdo/manage?sortKey=owner',
      auth
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(200)
    expect(getLiveCdos).toHaveBeenCalledWith(user, {
      column: 'owner',
      order: 'ASC'
    })
    const { document } = (new JSDOM(response.payload)).window

    expect(document.querySelectorAll('.govuk-table thead th a')[0].getAttribute('href')).toBe('/cdo/manage')
    expect(document.querySelectorAll('.govuk-table thead th')[0].getAttribute('data-aria-sort')).toBe('none')
    expect(document.querySelectorAll('.govuk-table thead th a')[2].getAttribute('href')).toBe('/cdo/manage?sortKey=owner&sortOrder=DESC')
    expect(document.querySelectorAll('.govuk-table thead th')[2].getAttribute('data-aria-sort')).toBe('ascending')
  })

  test('GET /cdo/manage?sortKey=owner&sortOrder=ASC route returns 200', async () => {
    getLiveCdos.mockResolvedValue(buildSummaryCdoResponse({}))

    const options = {
      method: 'GET',
      url: '/cdo/manage?sortKey=owner&sortOrder=ASC',
      auth
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(200)
    expect(getLiveCdos).toHaveBeenCalledWith(user, {
      column: 'owner',
      order: 'ASC'
    })
    const { document } = (new JSDOM(response.payload)).window
    expect(document.querySelectorAll('.govuk-table thead th a')[2].getAttribute('href')).toBe('/cdo/manage?sortKey=owner&sortOrder=DESC')
    expect(document.querySelectorAll('.govuk-table thead th')[2].getAttribute('data-aria-sort')).toBe('ascending')
  })

  test('GET /cdo/manage?sortKey=owner&sortOrder=DESC route returns 200', async () => {
    getLiveCdos.mockResolvedValue(buildSummaryCdoResponse({}))

    const options = {
      method: 'GET',
      url: '/cdo/manage?sortKey=owner&sortOrder=DESC',
      auth
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(200)
    expect(getLiveCdos).toHaveBeenCalledWith(user, {
      column: 'owner',
      order: 'DESC'
    })
    const { document } = (new JSDOM(response.payload)).window
    expect(document.querySelectorAll('.govuk-table thead th a')[2].getAttribute('href')).toBe('/cdo/manage?sortKey=owner')
    expect(document.querySelectorAll('.govuk-table thead th')[2].getAttribute('data-aria-sort')).toBe('descending')
  })

  test('GET /cdo/manage/due route returns 200', async () => {
    getLiveCdosWithinMonth.mockResolvedValue(buildSummaryCdoResponse({
      cdos: [
        {
          id: 20001,
          index: 'ED20001',
          status: 'Pre-exempt',
          owner: 'Scott Pilgrim',
          personReference: 'P-A133-7E4C',
          cdoExpiry: new Date('2024-04-19'),
          humanReadableCdoExpiry: '19 April 2024',
          joinedExemptionScheme: null,
          policeForce: 'Cheshire Constabulary'
        },
        {
          id: 20002,
          index: 'ED20002',
          status: 'Pre-exempt ',
          owner: 'Ramona Flowers ',
          personReference: 'P-A133-7E5C',
          cdoExpiry: new Date('2024-04-20'),
          humanReadableCdoExpiry: '20 April 2024',
          joinedExemptionScheme: null,
          policeForce: 'Kent Police '
        }
      ],
      counts: buildCdoCounts({ within30: 2 })
    }))

    const options = {
      method: 'GET',
      url: '/cdo/manage/due',
      auth
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(200)
    expect(getLiveCdosWithinMonth).toHaveBeenCalledWith(user, {
      column: 'cdoExpiry',
      order: 'ASC'
    })
    const { document } = (new JSDOM(response.payload)).window
    expect(document.querySelector('h1.govuk-heading-l').textContent.trim()).toBe('Manage CDOs')
    expect(document.querySelectorAll('.govuk-tabs__list-item--selected')[0].textContent.trim()).toBe('CDOs due within 30 days (2)')
    expect(document.querySelectorAll('.govuk-tabs__list-item--selected').length).toBe(1)
    expect(document.querySelector('.govuk-table')).not.toBeNull()
    expect(document.querySelector('.govuk-breadcrumbs__link').textContent.trim()).toBe('Home')
    expect(document.querySelector('.govuk-breadcrumbs__link').getAttribute('href')).toBe('/')
    expect(document.querySelectorAll('.govuk-table thead th')[0].textContent.trim()).toBe('CDO expiry')
    expect(document.querySelectorAll('.govuk-table thead th')[0].getAttribute('data-aria-sort')).toBe('ascending')
    expect(document.querySelectorAll('.govuk-table thead th a')[0].getAttribute('href')).toBe('/cdo/manage/due?sortOrder=DESC')
    expect(document.querySelectorAll('.govuk-table thead th')[1].textContent.trim()).toBe('Index number')
    expect(document.querySelectorAll('.govuk-table thead th')[1].getAttribute('data-aria-sort')).toBe('none')
    expect(document.querySelectorAll('.govuk-table thead th')[2].textContent.trim()).toBe('Owner')
    expect(document.querySelectorAll('.govuk-table thead th')[3].textContent.trim()).toBe('Police force')

    const cols = document.querySelectorAll('.govuk-table .govuk-table__row td')

    expect(cols[0].textContent.trim()).toBe('19 April 2024')
    expect(cols[1].textContent.trim()).toBe('ED20001')
    expect(cols[1].querySelector('.govuk-link').getAttribute('href')).toContain('/cdo/view/dog-details/ED20001')
    expect(cols[2].textContent.trim()).toBe('Scott Pilgrim')
    expect(cols[3].textContent.trim()).toBe('Cheshire Constabulary')
  })

  test('GET /cdo/manage/interim route returns 200', async () => {
    getInterimExemptions.mockResolvedValue(buildSummaryCdoResponse({
      cdos: [
        {
          id: 20001,
          index: 'ED20001',
          status: 'Pre-exempt',
          owner: 'Scott Pilgrim',
          personReference: 'P-A133-7E4C',
          cdoExpiry: null,
          humanReadableCdoExpiry: '',
          joinedExemptionScheme: new Date('2023-10-19'),
          interimExemptFor: '6 months',
          policeForce: 'Cheshire Constabulary'
        },
        {
          id: 20002,
          index: 'ED20002',
          status: 'Pre-exempt ',
          owner: 'Ramona Flowers ',
          personReference: 'P-A133-7E5C',
          cdoExpiry: null,
          humanReadableCdoExpiry: '',
          joinedExemptionScheme: new Date('2024-04-20'),
          interimExemptFor: '1 month',
          policeForce: 'Kent Police '
        }
      ]
    }))

    const options = {
      method: 'GET',
      url: '/cdo/manage/interim',
      auth
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(200)
    expect(getInterimExemptions).toHaveBeenCalledWith(user, {
      column: 'interimExemptFor',
      order: 'DESC'
    })
    const { document } = (new JSDOM(response.payload)).window
    expect(document.querySelector('h1.govuk-heading-l').textContent.trim()).toBe('Manage interim exemptions')
    expect(document.querySelector('ul[data-testid="tab-navigation"]')).toBeNull()
    expect(document.querySelector('.govuk-table')).not.toBeNull()
    expect(document.querySelector('.govuk-button--secondary').textContent.trim()).toBe('Manage CDOs')
    expect(document.querySelector('.govuk-button--secondary').getAttribute('href')).toBe('/cdo/manage')
    expect(document.querySelectorAll('.govuk-breadcrumbs__link')[0].textContent.trim()).toBe('Home')
    expect(document.querySelectorAll('.govuk-breadcrumbs__link')[0].getAttribute('href')).toBe('/')
    expect(document.querySelectorAll('.govuk-breadcrumbs__link')[1].textContent.trim()).toBe('Manage CDOs')
    expect(document.querySelectorAll('.govuk-breadcrumbs__link')[1].getAttribute('href')).toBe('/cdo/manage')
    expect(document.querySelectorAll('.govuk-table thead th')[0].textContent.trim()).toBe('Interim exempt for')
    expect(document.querySelectorAll('.govuk-table thead th')[0].getAttribute('data-aria-sort')).toBe('descending')
    expect(document.querySelectorAll('.govuk-table thead th a')[0].getAttribute('href')).toBe('/cdo/manage/interim?sortOrder=ASC')
    expect(document.querySelectorAll('.govuk-table thead th')[1].textContent.trim()).toBe('Index number')
    expect(document.querySelectorAll('.govuk-table thead th a')[1].getAttribute('href')).toBe('/cdo/manage/interim?sortKey=indexNumber')
    expect(document.querySelectorAll('.govuk-table thead th')[1].getAttribute('data-aria-sort')).toBe('none')
    expect(document.querySelectorAll('.govuk-table thead th')[2].textContent.trim()).toBe('Owner')
    expect(document.querySelectorAll('.govuk-table thead th')[2].getAttribute('data-aria-sort')).toBe('none')
    expect(document.querySelectorAll('.govuk-table thead th a')[2].getAttribute('href')).toBe('/cdo/manage/interim?sortKey=owner')
    expect(document.querySelectorAll('.govuk-table thead th')[3].textContent.trim()).toBe('Police force')
    expect(document.querySelectorAll('.govuk-table thead th')[3].getAttribute('data-aria-sort')).toBe('none')
    expect(document.querySelectorAll('.govuk-table thead th a')[3].getAttribute('href')).toBe('/cdo/manage/interim?sortKey=policeForce')

    const cols = document.querySelectorAll('.govuk-table .govuk-table__row td')

    expect(cols[0].textContent.trim()).toBe('6 months')
    expect(cols[1].textContent.trim()).toBe('ED20001')
    expect(cols[1].querySelector('.govuk-link').getAttribute('href')).toContain('/cdo/view/dog-details/ED20001')
    expect(cols[2].textContent.trim()).toBe('Scott Pilgrim')
    expect(cols[3].textContent.trim()).toBe('Cheshire Constabulary')
  })

  test('GET /cdo/manage/interim?sortOrder=ASC route returns 200', async () => {
    getInterimExemptions.mockResolvedValue(buildSummaryCdoResponse({}))

    const options = {
      method: 'GET',
      url: '/cdo/manage/interim?sortOrder=ASC',
      auth
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(200)
    expect(getInterimExemptions).toHaveBeenCalledWith(user, {
      column: 'interimExemptFor',
      order: 'ASC'
    })
    const { document } = (new JSDOM(response.payload)).window
    expect(document.querySelectorAll('.govuk-table thead th')[0].getAttribute('data-aria-sort')).toBe('ascending')
    expect(document.querySelectorAll('.govuk-table thead th a')[0].getAttribute('href')).toBe('/cdo/manage/interim')
  })

  test('GET /cdo/manage/interim?sortKey=indexNumber route returns 200', async () => {
    getInterimExemptions.mockResolvedValue(buildSummaryCdoResponse({}))

    const options = {
      method: 'GET',
      url: '/cdo/manage/interim?sortKey=indexNumber',
      auth
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(200)
    expect(getInterimExemptions).toHaveBeenCalledWith(user, {
      column: 'indexNumber',
      order: 'ASC'
    })
    const { document } = (new JSDOM(response.payload)).window
    expect(document.querySelectorAll('.govuk-table thead th a')[0].getAttribute('href')).toBe('/cdo/manage/interim')
    expect(document.querySelectorAll('.govuk-table thead th')[0].getAttribute('data-aria-sort')).toBe('none')
    expect(document.querySelectorAll('.govuk-table thead th a')[1].getAttribute('href')).toBe('/cdo/manage/interim?sortKey=indexNumber&sortOrder=DESC')
    expect(document.querySelectorAll('.govuk-table thead th')[1].getAttribute('data-aria-sort')).toBe('ascending')
  })

  test('GET /cdo/manage/interim?sortKey=indexNumber&sortOrder=DESC route returns 200', async () => {
    getInterimExemptions.mockResolvedValue(buildSummaryCdoResponse({}))

    const options = {
      method: 'GET',
      url: '/cdo/manage/interim?sortKey=indexNumber&sortOrder=DESC',
      auth
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(200)
    expect(getInterimExemptions).toHaveBeenCalledWith(user, {
      column: 'indexNumber',
      order: 'DESC'
    })
    const { document } = (new JSDOM(response.payload)).window
    expect(document.querySelectorAll('.govuk-table thead th a')[0].getAttribute('href')).toBe('/cdo/manage/interim')
    expect(document.querySelectorAll('.govuk-table thead th')[0].getAttribute('data-aria-sort')).toBe('none')
    expect(document.querySelectorAll('.govuk-table thead th a')[1].getAttribute('href')).toBe('/cdo/manage/interim?sortKey=indexNumber')
    expect(document.querySelectorAll('.govuk-table thead th')[1].getAttribute('data-aria-sort')).toBe('descending')
  })

  test('GET /cdo/manage/expired route returns 200', async () => {
    getExpiredCdos.mockResolvedValue(buildSummaryCdoResponse({
      cdos: [
        {
          id: 20001,
          index: 'ED20001',
          status: 'Pre-exempt',
          owner: 'Scott Pilgrim',
          personReference: 'P-A133-7E4C',
          cdoExpiry: null,
          humanReadableCdoExpiry: '',
          joinedExemptionScheme: new Date('2023-10-19'),
          interimExemptFor: '6 months',
          policeForce: 'Cheshire Constabulary'
        },
        {
          id: 20002,
          index: 'ED20002',
          status: 'Pre-exempt ',
          owner: 'Ramona Flowers ',
          personReference: 'P-A133-7E5C',
          cdoExpiry: null,
          humanReadableCdoExpiry: '',
          joinedExemptionScheme: new Date('2024-04-20'),
          interimExemptFor: '1 month',
          policeForce: 'Kent Police '
        }
      ],
      counts: buildCdoCounts({ nonComplianceLetterNotSent: 2 })
    }))

    const options = {
      method: 'GET',
      url: '/cdo/manage/expired',
      auth
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(200)
    expect(getExpiredCdos).toHaveBeenCalledWith(user, {
      column: 'cdoExpiry',
      order: 'ASC'
    })
    const { document } = (new JSDOM(response.payload)).window
    expect(document.querySelectorAll('.govuk-tabs__list-item--selected')[0].textContent.trim()).toBe('Expired CDOs (2)')
    expect(document.querySelectorAll('.govuk-table thead th a')[0].getAttribute('href')).toBe('/cdo/manage/expired?sortOrder=DESC')
    expect(document.querySelectorAll('.govuk-table thead th')[0].getAttribute('data-aria-sort')).toBe('ascending')
    expect(document.querySelectorAll('.govuk-tabs__list-item--selected').length).toBe(1)
    expect(document.querySelector('.govuk-table')).not.toBeNull()
    expect(document.querySelectorAll('.govuk-table__row').length).toBe(3)
  })

  test('GET /cdo/manage/invalid-tab route returns 404', async () => {
    const options = {
      method: 'GET',
      url: '/cdo/manage/invalid-tab',
      auth
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(404)
  })

  test('GET /cdo/manage route returns 302 if not auth', async () => {
    const fd = new FormData()

    const options = {
      method: 'GET',
      url: '/cdo/manage',
      headers: fd.getHeaders(),
      payload: fd.getBuffer()
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(302)
  })

  afterEach(async () => {
    jest.clearAllMocks()
    await server.stop()
  })
})
