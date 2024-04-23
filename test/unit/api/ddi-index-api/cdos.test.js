describe('CDO API endpoints', () => {
  jest.mock('../../../../app/api/ddi-index-api/base')
  const { get } = require('../../../../app/api/ddi-index-api/base')

  const { cdos } = require('../../../../app/api/ddi-index-api')

  beforeEach(() => {
    jest.clearAllMocks()
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
              cdoExpiry: '2024-04-19'
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
  })
})
