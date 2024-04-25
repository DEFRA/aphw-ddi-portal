describe('CDO API endpoints', () => {
  jest.mock('../../../../app/api/ddi-index-api/base')
  const { get } = require('../../../../app/api/ddi-index-api/base')

  const { cdos } = require('../../../../app/api/ddi-index-api')
  const { summaryCdoMapper } = require('../../../../app/api/ddi-index-api/cdos')

  beforeEach(() => {
    jest.clearAllMocks()
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
        policeForce: 'Cheshire Constabulary'
      }
      expect(summaryCdoMapper(summaryCdoDto)).toEqual(expectedSummaryCdoDto)
    })

    test('should map a SummaryCdoDto to a SummaryCdo given Interim Exempt', () => {
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
        policeForce: 'Cheshire Constabulary'
      }
      expect(summaryCdoMapper(summaryCdoDto)).toEqual(expectedSummaryCdoDto)
    })
  })

  describe('getSummaryCdos', () => {
    test('should call endpoint with a single status and dueWithin', async () => {
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
  })

  describe('getInterimExemptions', () => {
    test('should get interim exemptions', async () => {
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

    test('should get interim exemptions descending by joinedExemptionScheme', async () => {
      get.mockResolvedValue({
        cdos: []
      })
      const sort = {
        order: 'DESC'
      }

      const results = await cdos.getInterimExemptions(sort)
      expect(get).toBeCalledWith('cdos?status=InterimExempt&sortKey=joinedExemptionScheme&sortOrder=DESC', { json: true })
      expect(results).toEqual(expect.any(Array))
    })
  })
})
