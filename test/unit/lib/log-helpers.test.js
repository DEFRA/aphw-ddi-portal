const Joi = require('joi')
const log = jest.spyOn(console, 'log').mockImplementation(() => {})

const { logValidationError } = require('../../../app/lib/log-helpers')

const testErrorSingle = new Joi.ValidationError('testErrorSingle',
  [
    {
      message: 'testErrorSingle',
      path: ['testErrorPath'],
      type: 'testSingle'
    }
  ])

const testErrorsWithPath = new Joi.ValidationError('testErrorsWithPath',
  [
    {
      message: 'testErrorsWithPath1',
      path: ['testErrorPath'],
      type: 'testErrorsWithPath'
    },
    {
      message: 'testErrorsWithPath2',
      path: ['testErrorPath'],
      type: 'testErrorsWithPath'
    }
  ]
)

const testErrorsWithContextPath = new Joi.ValidationError('testErrorsWithContextPath',
  [
    {
      message: 'testErrorsWithContextPath1',
      type: 'testErrorsWithContextPath',
      context: { path: ['testErrorContext'] }
    },
    {
      message: 'testErrorsWithContextPath2',
      type: 'testErrorsWithContextPath'
    }
  ]
)

describe('LogHelpers', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  afterAll(() => {
    log.mockReset()
  })

  describe('logValidationError', () => {
    test('handles null error object', () => {
      logValidationError(null)
      expect(log).not.toHaveBeenCalled()
    })

    test('handles route name', () => {
      logValidationError(testErrorSingle, '/route/name')
      expect(log).toHaveBeenCalledTimes(1)
      expect(log).toHaveBeenCalledWith('Validation error in /route/name: elementName=testErrorPath message=testErrorSingle')
    })

    test('handles missing route name', () => {
      logValidationError(testErrorSingle)
      expect(log).toHaveBeenCalledTimes(1)
      expect(log).toHaveBeenCalledWith('Validation error in unknown: elementName=testErrorPath message=testErrorSingle')
    })

    test('handles errors using path', () => {
      logValidationError(testErrorsWithPath)
      expect(log).toHaveBeenCalledTimes(2)
      expect(log.mock.calls[0]).toEqual(['Validation error in unknown: elementName=testErrorPath message=testErrorsWithPath1'])
      expect(log.mock.calls[1]).toEqual(['Validation error in unknown: elementName=testErrorPath message=testErrorsWithPath2'])
    })

    test('handles errors using context-path', () => {
      logValidationError(testErrorsWithContextPath)
      expect(log).toHaveBeenCalledTimes(2)
      expect(log.mock.calls[0]).toEqual(['Validation error in unknown: elementName=testErrorContext message=testErrorsWithContextPath1'])
      expect(log.mock.calls[1]).toEqual(['Validation error in unknown: elementName=undefined message=testErrorsWithContextPath2'])
    })
  })
})
