const { backNav } = require('../../../../../../app/routes/cdo/edit/select-activity-helper')

jest.mock('../../../../../../app/lib/back-helpers')
const { getMainReturnPoint } = require('../../../../../../app/lib/back-helpers')

describe('Select activity helper', () => {
  beforeEach(() => {
    getMainReturnPoint.mockReturnValue('/main-return-point')
  })

  test('backNav returns prev url', () => {
    const request = {}
    const details = {
      pk: 'pk1',
      source: 'source1'
    }
    const res = backNav(details, request)
    expect(res).toEqual({
      backLink: '/cdo/edit/add-activity/pk1/source1'
    })
  })

  test('backNav returns prev url with srcHashParam', () => {
    const request = {}
    const details = {
      pk: 'pk1',
      source: 'source1',
      srcHashParam: 'srcHashParam'
    }
    const res = backNav(details, request)
    expect(res).toEqual({
      backLink: '/cdo/edit/add-activity/pk1/source1?src=srcHashParam'
    })
  })

  test('backNav returns main return point', () => {
    const request = {}
    const details = {
      pk: 'pk1',
      source: 'source1',
      skippedFirstPage: 'true'
    }
    const res = backNav(details, request)
    expect(res).toEqual({
      backLink: '/main-return-point'
    })
  })
})
