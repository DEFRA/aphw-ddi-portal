describe('CDO API endpoints', () => {
  jest.mock('../../../../app/api/ddi-index-api/base')
  const { get } = require('../../../../app/api/ddi-index-api/base')

  const { cdos } = require('../../../../app/api/ddi-index-api')

  beforeEach(() => {
    jest.clearAllMocks()
  })
  describe('getSummaryCdos', () => {
    test('should get summary cdos', async () => {
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

      const summaryCdoDtos = await cdos.getSummaryCdos()

      expect(get).toBeCalledWith('cdos', { json: true })
      expect(summaryCdoDtos).toEqual([expectedSummaryCdoDto])
    })
  })
})
