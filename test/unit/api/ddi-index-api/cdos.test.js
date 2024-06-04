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

      get.mockResolvedValue({
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
        ]
      })

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

      const summaryCdoDtos = await cdos.getSummaryCdos({ dueWithin: 30, status: ['PreExempt'] })

      expect(get).toBeCalledWith('cdos?status=PreExempt&withinDays=30', { json: true })
      expect(summaryCdoDtos).toEqual([expectedSummaryCdoDto])
    })

    test('should call endpoint with a single status', async () => {
      get.mockResolvedValue({
        cdos: []
      })

      await cdos.getSummaryCdos({ status: ['PreExempt'] })

      expect(get).toBeCalledWith('cdos?status=PreExempt', { json: true })
    })

    test('should call endpoint with multiple statuses', async () => {
      get.mockResolvedValue({
        cdos: []
      })

      await cdos.getSummaryCdos({ status: ['PreExempt', 'InterimExempt'] })

      expect(get).toBeCalledWith('cdos?status=PreExempt&status=InterimExempt', { json: true })
    })

    test('should call endpoint with dueWithin', async () => {
      get.mockResolvedValue({
        cdos: []
      })
      await cdos.getSummaryCdos({ dueWithin: 30 })

      expect(get).toBeCalledWith('cdos?withinDays=30', { json: true })
    })

    test('should call endpoint with a sort order', async () => {
      get.mockResolvedValue({
        cdos: []
      })

      const sort = {
        column: 'joinedExemptionScheme',
        order: 'DESC'
      }

      await cdos.getSummaryCdos({ status: ['InterimExempt'] }, sort)

      expect(get).toBeCalledWith('cdos?status=InterimExempt&sortKey=joinedExemptionScheme&sortOrder=DESC', { json: true })
    })
  })

  describe('getLiveCdos', () => {
    test('should get cdos', async () => {
      get.mockResolvedValue({
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
        ]
      })

      const sort = {}

      const results = await cdos.getLiveCdos(sort)
      expect(get).toBeCalledWith('cdos?status=PreExempt', { json: true })
      expect(results).toEqual(expect.any(Array))
    })

    test('should get cdos given no sort arguments', async () => {
      get.mockResolvedValue({
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
        ]
      })

      const results = await cdos.getLiveCdos()
      expect(get).toBeCalledWith('cdos?status=PreExempt', { json: true })
      expect(results).toEqual(expect.any(Array))
    })
  })

  describe('getLiveCdosWithinMonth', () => {
    test('should get cdos due within one month', async () => {
      get.mockResolvedValue({
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
        ]
      })
      const sort = {}

      const results = await cdos.getLiveCdosWithinMonth(sort)
      expect(get).toBeCalledWith('cdos?status=PreExempt&withinDays=30', { json: true })
      expect(results).toEqual(expect.any(Array))
    })

    test('should get cdos due within one month with default sort', async () => {
      get.mockResolvedValue({
        cdos: []
      })

      await cdos.getLiveCdosWithinMonth()
      expect(get).toBeCalledWith('cdos?status=PreExempt&withinDays=30', { json: true })
    })
  })

  describe('getInterimExemptions', () => {
    test('should get interim exemptions defaulting to ASC', async () => {
      get.mockResolvedValue({
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
      })
      const sort = {}

      const results = await cdos.getInterimExemptions(sort)
      expect(get).toBeCalledWith('cdos?status=InterimExempt&sortKey=joinedExemptionScheme', { json: true })
      expect(results).toEqual(expect.any(Array))
    })

    test('should get interim exemptions with default sort', async () => {
      get.mockResolvedValue({
        cdos: []
      })

      await cdos.getInterimExemptions()
      expect(get).toBeCalledWith('cdos?status=InterimExempt&sortKey=joinedExemptionScheme', { json: true })
    })

    test('should get interim exemptions with default sort', async () => {
      get.mockResolvedValue({
        cdos: []
      })

      await cdos.getInterimExemptions({ column: 'joinedExemptionScheme' })
      expect(get).toBeCalledWith('cdos?status=InterimExempt&sortKey=joinedExemptionScheme', { json: true })
    })

    test('should get interim exemptions ascending by joinedExemptionScheme when called with descending', async () => {
      get.mockResolvedValue({
        cdos: []
      })
      const sort = {
        order: 'DESC'
      }

      const results = await cdos.getInterimExemptions(sort)
      expect(get).toBeCalledWith('cdos?status=InterimExempt&sortKey=joinedExemptionScheme', { json: true })
      expect(results).toEqual(expect.any(Array))
    })

    test('should get interim exemptions descending by joinedExemptionScheme when called with ascending', async () => {
      get.mockResolvedValue({
        cdos: []
      })
      const sort = {
        order: 'ASC'
      }

      const results = await cdos.getInterimExemptions(sort)
      expect(get).toBeCalledWith('cdos?status=InterimExempt&sortKey=joinedExemptionScheme&sortOrder=DESC', { json: true })
      expect(results).toEqual(expect.any(Array))
    })
  })

  describe('getExpiredCdos', () => {
    test('should get expired cdos', async () => {
      get.mockResolvedValue({
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
      })
      const sort = {}

      const results = await cdos.getExpiredCdos(sort)
      expect(get).toBeCalledWith('cdos?status=Failed&nonComplianceLetterSent=false', { json: true })
      expect(results).toEqual(expect.any(Array))
    })

    test('should get expired cdos given no sort arguments passed', async () => {
      get.mockResolvedValue({
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
      })

      const results = await cdos.getExpiredCdos()
      expect(get).toBeCalledWith('cdos?status=Failed&nonComplianceLetterSent=false', { json: true })
      expect(results).toEqual(expect.any(Array))
    })
  })
})
