const { user } = require('../../../mocks/auth')
const { buildSummaryCdosApiResponse, buildCdoCounts } = require('../../../mocks/cdo/cdos')
describe('CDO API endpoints', () => {
  jest.mock('../../../../app/api/ddi-index-api/base')
  const { get } = require('../../../../app/api/ddi-index-api/base')

  const { cdos } = require('../../../../app/api/ddi-index-api')
  const { summaryCdoMapper } = require('../../../../app/api/ddi-index-api/cdos')

  beforeEach(() => {
    jest.clearAllMocks()
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  describe('summaryCdoMapper', () => {
    test('should map a SummaryCdoDto to a SummaryCdo', () => {
      const summaryCdoDto = {
        person: {
          id: 121,
          firstName: 'Scott',
          lastName: 'Pilgrim',
          personReference: 'P-A133-7E4C'
        },
        dog: {
          id: 300162,
          status: 'Pre-exempt',
          dogReference: 'ED300162'
        },
        exemption: {
          policeForce: 'Cheshire Constabulary',
          cdoExpiry: '2024-04-19',
          joinedExemptionScheme: null
        }
      }
      /**
       * @type {SummaryCdo}
       */
      const expectedSummaryCdoDto = {
        id: 300162,
        index: 'ED300162',
        status: 'Pre-exempt',
        owner: 'Scott Pilgrim',
        personReference: 'P-A133-7E4C',
        cdoExpiry: new Date('2024-04-19'),
        humanReadableCdoExpiry: '19 April 2024',
        joinedExemptionScheme: null,
        interimExemptFor: null,
        policeForce: 'Cheshire Constabulary'
      }
      expect(summaryCdoMapper(summaryCdoDto)).toEqual(expectedSummaryCdoDto)
    })

    test('should map a SummaryCdoDto to a SummaryCdo given Interim Exempt', () => {
      jest.useFakeTimers()
      jest.setSystemTime(new Date('2024-04-25'))

      const summaryCdoDto = {
        person: {
          id: 121,
          firstName: 'Scott',
          lastName: 'Pilgrim',
          personReference: 'P-A133-7E4C'
        },
        dog: {
          id: 300162,
          status: 'Interim exempt',
          dogReference: 'ED300162'
        },
        exemption: {
          policeForce: 'Cheshire Constabulary',
          cdoExpiry: null,
          joinedExemptionScheme: '2024-04-19'
        }
      }
      /**
       * @type {SummaryCdo}
       */
      const expectedSummaryCdoDto = {
        id: 300162,
        index: 'ED300162',
        status: 'Interim exempt',
        owner: 'Scott Pilgrim',
        personReference: 'P-A133-7E4C',
        cdoExpiry: null,
        humanReadableCdoExpiry: '',
        joinedExemptionScheme: new Date('2024-04-19'),
        interimExemptFor: 'Less than 1 month',
        policeForce: 'Cheshire Constabulary'
      }
      expect(summaryCdoMapper(summaryCdoDto)).toEqual(expectedSummaryCdoDto)
    })
  })

  describe('getSummaryCdos', () => {
    test('should call endpoint with a single status and dueWithin', async () => {
      jest.useFakeTimers()
      jest.setSystemTime(new Date('2024-04-25'))

      get.mockResolvedValue(buildSummaryCdosApiResponse({
        cdos: [
          {
            person: {
              id: 121,
              firstName: 'Scott',
              lastName: 'Pilgrim',
              personReference: 'P-A133-7E4C'
            },
            dog: {
              id: 300162,
              status: 'Pre-exempt',
              dogReference: 'ED300162'
            },
            exemption: {
              policeForce: 'Cheshire Constabulary',
              cdoExpiry: '2024-04-19',
              joinedExemptionScheme: '2024-04-19'
            }
          }
        ],
        counts: buildCdoCounts({ total: 1 })
      }))

      /**
       * @type {SummaryCdo}
       */
      const expectedSummaryCdoDto = {
        id: 300162,
        index: 'ED300162',
        status: 'Pre-exempt',
        owner: 'Scott Pilgrim',
        personReference: 'P-A133-7E4C',
        cdoExpiry: new Date('2024-04-19'),
        humanReadableCdoExpiry: '19 April 2024',
        joinedExemptionScheme: new Date('2024-04-19'),
        interimExemptFor: 'Less than 1 month',
        policeForce: 'Cheshire Constabulary'
      }

      const summaryCdoDtos = await cdos.getSummaryCdos({ dueWithin: 30, status: ['PreExempt'] }, true, user)

      expect(get).toBeCalledWith('cdos?status=PreExempt&withinDays=30&noCache=true', user)
      expect(summaryCdoDtos).toEqual({ cdos: [expectedSummaryCdoDto], counts: buildCdoCounts({ total: 1 }) })
    })

    test('should call endpoint with a single status', async () => {
      get.mockResolvedValue(buildSummaryCdosApiResponse({}))

      await cdos.getSummaryCdos({ status: ['PreExempt'] }, false, user)

      expect(get).toBeCalledWith('cdos?status=PreExempt', user)
    })

    test('should call endpoint with multiple statuses', async () => {
      get.mockResolvedValue(buildSummaryCdosApiResponse({
        cdos: []
      }))

      await cdos.getSummaryCdos({ status: ['PreExempt', 'InterimExempt'] }, false, user)

      expect(get).toBeCalledWith('cdos?status=PreExempt&status=InterimExempt', user)
    })

    test('should call endpoint with dueWithin', async () => {
      get.mockResolvedValue(buildSummaryCdosApiResponse({
        cdos: []
      }))
      await cdos.getSummaryCdos({ dueWithin: 30 }, false, user)

      expect(get).toBeCalledWith('cdos?withinDays=30', user)
    })

    test('should call endpoint with a sort order', async () => {
      get.mockResolvedValue(buildSummaryCdosApiResponse({
        cdos: []
      }))

      const sort = {
        column: 'joinedExemptionScheme',
        order: 'DESC'
      }

      await cdos.getSummaryCdos({ status: ['InterimExempt'] }, false, user, sort)

      expect(get).toBeCalledWith('cdos?status=InterimExempt&sortKey=joinedExemptionScheme&sortOrder=DESC', user)
    })
  })

  describe('getLiveCdos', () => {
    test('should get cdos', async () => {
      get.mockResolvedValue(buildSummaryCdosApiResponse({
        cdos: [
          {
            person: {
              id: 121,
              firstName: 'Scott',
              lastName: 'Pilgrim',
              personReference: 'P-A133-7E4C'
            },
            dog: {
              id: 300162,
              status: 'Pre-exempt',
              dogReference: 'ED300162'
            },
            exemption: {
              policeForce: 'Cheshire Constabulary',
              cdoExpiry: '2024-04-19'
            }
          }
        ],
        counts: {
          preExempt: {
            total: 1,
            within30: 0
          },
          failed: {
            nonComplianceLetterNotSent: 0
          }
        }
      }))

      const sort = {}

      const results = await cdos.getLiveCdos(true, user, sort)
      expect(get).toBeCalledWith('cdos?status=PreExempt&noCache=true', user)
      expect(results).toEqual({ cdos: expect.any(Array), counts: buildCdoCounts({ total: 1 }) })
    })

    test('should get cdos given no sort arguments', async () => {
      get.mockResolvedValue(buildSummaryCdosApiResponse({
        cdos: [
          {
            person: {
              id: 121,
              firstName: 'Scott',
              lastName: 'Pilgrim',
              personReference: 'P-A133-7E4C'
            },
            dog: {
              id: 300162,
              status: 'Pre-exempt',
              dogReference: 'ED300162'
            },
            exemption: {
              policeForce: 'Cheshire Constabulary',
              cdoExpiry: '2024-04-19'
            }
          }
        ],
        counts: buildCdoCounts({ total: 1 })
      }))

      const results = await cdos.getLiveCdos(false, user)
      expect(get).toBeCalledWith('cdos?status=PreExempt', user)
      expect(results).toEqual({ cdos: expect.any(Array), counts: buildCdoCounts({ total: 1 }) })
    })
  })

  describe('getLiveCdosWithinMonth', () => {
    test('should get cdos due within one month', async () => {
      get.mockResolvedValue(buildSummaryCdosApiResponse({
        cdos: [
          {
            person: {
              id: 121,
              firstName: 'Scott',
              lastName: 'Pilgrim',
              personReference: 'P-A133-7E4C'
            },
            dog: {
              id: 300162,
              status: 'Pre-exempt',
              dogReference: 'ED300162'
            },
            exemption: {
              policeForce: 'Cheshire Constabulary',
              cdoExpiry: '2024-04-19'
            }
          }
        ],
        counts: buildCdoCounts({ within30: 1 })
      }))
      const sort = {}

      const results = await cdos.getLiveCdosWithinMonth(true, user, sort)
      expect(get).toBeCalledWith('cdos?status=PreExempt&withinDays=30&noCache=true', user)
      expect(results).toEqual({ cdos: expect.any(Array), counts: buildCdoCounts({ within30: 1 }) })
    })

    test('should get cdos due within one month with default sort', async () => {
      get.mockResolvedValue({
        cdos: []
      })

      await cdos.getLiveCdosWithinMonth(false, user)
      expect(get).toBeCalledWith('cdos?status=PreExempt&withinDays=30', user)
    })
  })

  describe('getInterimExemptions', () => {
    test('should get interim exemptions defaulting to ASC', async () => {
      get.mockResolvedValue(buildSummaryCdosApiResponse({
        cdos: [
          {
            person: {
              id: 121,
              firstName: 'Scott',
              lastName: 'Pilgrim',
              personReference: 'P-A133-7E4C'
            },
            dog: {
              id: 300162,
              status: 'Interim exempt',
              dogReference: 'ED300162'
            },
            exemption: {
              policeForce: 'Cheshire Constabulary',
              cdoExpiry: null,
              joinedExemptionScheme: '2020-10-11'
            }
          }
        ]
      }))
      const sort = {}

      const results = await cdos.getInterimExemptions(user, sort)
      expect(get).toBeCalledWith('cdos?status=InterimExempt&sortKey=joinedExemptionScheme', user)
      expect(results).toEqual({ cdos: expect.any(Array), counts: expect.anything() })
    })

    test('should get interim exemptions with default sort', async () => {
      get.mockResolvedValue(buildSummaryCdosApiResponse({
        cdos: []
      }))

      await cdos.getInterimExemptions(user)
      expect(get).toBeCalledWith('cdos?status=InterimExempt&sortKey=joinedExemptionScheme', user)
    })

    test('should get interim exemptions with default sort', async () => {
      get.mockResolvedValue(buildSummaryCdosApiResponse({
        cdos: []
      }))

      await cdos.getInterimExemptions(user, { column: 'joinedExemptionScheme' })
      expect(get).toBeCalledWith('cdos?status=InterimExempt&sortKey=joinedExemptionScheme', user)
    })

    test('should get interim exemptions ascending by joinedExemptionScheme when called with descending', async () => {
      get.mockResolvedValue(buildSummaryCdosApiResponse({
        cdos: []
      }))
      const sort = {
        order: 'DESC'
      }

      await cdos.getInterimExemptions(user, sort)
      expect(get).toBeCalledWith('cdos?status=InterimExempt&sortKey=joinedExemptionScheme', user)
    })

    test('should get interim exemptions descending by joinedExemptionScheme when called with ascending', async () => {
      get.mockResolvedValue(buildSummaryCdosApiResponse({
        cdos: []
      }))
      const sort = {
        order: 'ASC'
      }

      await cdos.getInterimExemptions(user, sort)
      expect(get).toBeCalledWith('cdos?status=InterimExempt&sortKey=joinedExemptionScheme&sortOrder=DESC', user)
    })
  })

  describe('getExpiredCdos', () => {
    test('should get expired cdos', async () => {
      get.mockResolvedValue(buildSummaryCdosApiResponse({
        cdos: [
          {
            person: {
              id: 121,
              firstName: 'Scott',
              lastName: 'Pilgrim',
              personReference: 'P-A133-7E4C'
            },
            dog: {
              id: 300162,
              status: 'Interim exempt',
              dogReference: 'ED300162'
            },
            exemption: {
              policeForce: 'Cheshire Constabulary',
              cdoExpiry: null,
              joinedExemptionScheme: '2020-10-11'
            }
          }
        ],
        counts: buildCdoCounts({ nonComplianceLetterNotSent: 1 })
      }))
      const sort = {}

      const results = await cdos.getExpiredCdos(true, user, sort)
      expect(get).toBeCalledWith('cdos?status=Failed&nonComplianceLetterSent=false&noCache=true', user)
      expect(results).toEqual({ cdos: expect.any(Array), counts: buildCdoCounts({ nonComplianceLetterNotSent: 1 }) })
    })

    test('should get expired cdos given no sort arguments passed', async () => {
      get.mockResolvedValue(buildSummaryCdosApiResponse({
        cdos: [
          {
            person: {
              id: 121,
              firstName: 'Scott',
              lastName: 'Pilgrim',
              personReference: 'P-A133-7E4C'
            },
            dog: {
              id: 300162,
              status: 'Interim exempt',
              dogReference: 'ED300162'
            },
            exemption: {
              policeForce: 'Cheshire Constabulary',
              cdoExpiry: null,
              joinedExemptionScheme: '2020-10-11'
            }
          }
        ],
        counts: buildCdoCounts({ nonComplianceLetterNotSent: 1 })
      }))

      const results = await cdos.getExpiredCdos(false, user)
      expect(get).toBeCalledWith('cdos?status=Failed&nonComplianceLetterSent=false', user)
      expect(results).toEqual({ cdos: expect.any(Array), counts: buildCdoCounts({ nonComplianceLetterNotSent: 1 }) })
    })
  })
})
