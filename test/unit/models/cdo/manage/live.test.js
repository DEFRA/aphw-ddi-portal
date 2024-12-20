const ViewModel = require('../../../../../app/models/cdo/manage/live')
const { buildSummaryTaskList, buildSummaryCdo } = require('../../../../mocks/cdo/cdos')
describe('Manage CDOs ', () => {
  const FORM_2 = 'Form 2'
  const APPLICATION_PACK = 'Application pack'
  const INSURANCE = 'Evidence of insurance'
  const APPLICATION_FEE = 'Application fee'

  const tab = 'live'
  const sort = { column: 'cdoExpiry', order: 'ASC' }

  /**
   *
   * @type {SummaryCdo[]}
   */
  const summaryCdos = [{
    id: 400153,
    index: 'ED400153',
    owner: 'Sherlock Holmes',
    personReference: 'P-5241-15E2',
    policeForce: 'Metropolitan Police Service',
    status: 'Pre-exempt',
    cdoExpiry: '2024-12-31T00:00:00.000Z',
    humanReadableCdoExpiry: '31 December 2024',
    joinedExemptionScheme: null,
    interimExemptFor: null,
    taskList: []
  }]

  /**
   * @type {ManageCdoCounts}
   */
  const counts = {
    preExempt: {
      total: 1,
      within30: 1
    },
    failed: { nonComplianceLetterNotSent: 100122 }
  }

  const backNav = {
    backLink: '/',
    srcHashParam: '?src=e95f-50b4',
    srcHashValue: 'e95f-50b4',
    currentHashParam: ''
  }

  const modelBase = {
    title: 'Manage CDOs',
    backLink: '/',
    breadcrumbs: [{ label: 'Home', link: '/' }],
    resultList: [
      {
        cdoExpiry: '2024-12-31T00:00:00.000Z',
        humanReadableCdoExpiry: '31 December 2024',
        id: 400153,
        index: 'ED400153',
        interimExemptFor: null,
        joinedExemptionScheme: null,
        owner: 'Sherlock Holmes',
        personReference: 'P-5241-15E2',
        policeForce: 'Metropolitan Police Service',
        status: 'Pre-exempt',
        notReceived: []
      }
    ],
    secondaryBtn: {
      label: 'Interim exemptions',
      link: '/cdo/manage/interim'
    },
    showTabNav: true,
    sort: {
      column: 'cdoExpiry',
      order: 'ASC'
    },
    srcHashParam: '?src=e95f-50b4',
    tab: 'live',
    tableHeadings: [
      {
        ariaSort: 'ascending',
        label: 'CDO expiry',
        link: '/cdo/manage?sortOrder=DESC'
      },
      {
        ariaSort: 'none',
        label: 'Index number',
        link: '/cdo/manage?sortKey=indexNumber'
      },
      {
        ariaSort: 'none',
        label: 'Owner',
        link: '/cdo/manage?sortKey=owner'
      },
      {
        ariaSort: 'none',
        label: 'Police force',
        link: '/cdo/manage?sortKey=policeForce'
      }
    ],
    tabs: [
      {
        active: true,
        href: '/cdo/manage',
        label: 'Live CDOs (1)',
        visible: true
      },
      {
        active: false,
        href: '/cdo/manage/expired',
        label: 'Expired CDOs (100122)',
        visible: true
      },
      {
        active: false,
        href: '/cdo/manage/due',
        label: 'CDOs due within 30 days (1)',
        visible: true
      }
    ]
  }
  test('should return the correct results', () => {
    const viewModel = new ViewModel(summaryCdos, counts, tab, sort, backNav)

    expect(viewModel.model).toEqual({
      ...modelBase
    })
  })

  test('should return the tasklist', () => {
    /**
     * @type {SummaryCdo[]}
     */
    const summaryCdos = [
      buildSummaryCdo({
        id: 400153,
        index: 'ED400153',
        owner: 'Sherlock Holmes',
        taskList: buildSummaryTaskList({
          applicationPackSent: {
            available: true,
            completed: false
          },
          applicationPackProcessed: {
            available: false,
            completed: false
          },
          insuranceDetailsRecorded: {
            available: false,
            completed: false
          },
          applicationFeePaid: {
            available: false,
            completed: false
          },
          form2Sent: {
            available: false,
            completed: false
          },
          verificationDateRecorded: {
            available: false,
            completed: false
          }
        })
      }),
      buildSummaryCdo({
        id: 400154,
        index: 'ED400154',
        owner: 'John H. Watson',
        taskList: buildSummaryTaskList({
          applicationPackSent: {
            available: true,
            completed: true,
            readonly: true,
            timestamp: '2024-12-20T00:00:00.000Z'
          },
          applicationPackProcessed: {
            available: true,
            completed: true,
            readonly: true,
            timestamp: '2024-12-20T00:00:00.000Z'
          },
          insuranceDetailsRecorded: {
            available: true,
            completed: false
          },
          applicationFeePaid: {
            available: true,
            completed: false
          },
          form2Sent: {
            available: true,
            completed: false
          },
          verificationDateRecorded: {
            available: true,
            completed: false
          }
        })
      }),
      buildSummaryCdo({
        id: 400155,
        index: 'ED400155',
        owner: 'James Moriarty',
        taskList: buildSummaryTaskList({
          applicationPackSent: {
            available: true,
            completed: true,
            timestamp: '2024-12-20T00:00:00.000Z'
          },
          applicationPackProcessed: {
            available: true,
            completed: true,
            timestamp: '2024-12-20T00:00:00.000Z'
          },
          insuranceDetailsRecorded: {
            available: true,
            completed: false
          },
          applicationFeePaid: {
            available: true,
            completed: true,
            timestamp: '2024-12-20T00:00:00.000Z'
          },
          form2Sent: {
            available: true,
            completed: false
          },
          verificationDateRecorded: {
            available: true,
            completed: false
          }
        })
      }),
      buildSummaryCdo({
        id: 400156,
        index: 'ED400156',
        owner: 'Irene Adler',
        taskList: buildSummaryTaskList({
          applicationPackSent: {
            available: true,
            completed: true,
            timestamp: '2024-12-20T00:00:00.000Z'
          },
          applicationPackProcessed: {
            available: true,
            completed: true,
            timestamp: '2024-12-20T00:00:00.000Z'
          },
          insuranceDetailsRecorded: {
            available: true,
            completed: true,
            timestamp: '2024-12-20T00:00:00.000Z'
          },
          applicationFeePaid: {
            available: true,
            completed: true,
            timestamp: '2024-12-20T00:00:00.000Z'
          },
          form2Sent: {
            available: true,
            completed: false
          },
          verificationDateRecorded: {
            available: true,
            completed: false
          }
        })
      }),
      buildSummaryCdo({
        id: 400157,
        index: 'ED400157',
        owner: 'William Morris',
        taskList: buildSummaryTaskList({
          applicationPackSent: {
            available: true,
            completed: true,
            timestamp: '2024-12-20T00:00:00.000Z'
          },
          applicationPackProcessed: {
            available: true,
            completed: true,
            timestamp: '2024-12-20T00:00:00.000Z'
          },
          insuranceDetailsRecorded: {
            available: true,
            completed: true,
            timestamp: '2024-12-20T00:00:00.000Z'
          },
          applicationFeePaid: {
            available: true,
            completed: true,
            timestamp: '2024-12-20T00:00:00.000Z'
          },
          form2Sent: {
            available: true,
            completed: true,
            timestamp: '2024-12-20T00:00:00.000Z'
          },
          verificationDateRecorded: {
            available: true,
            completed: true,
            timestamp: '2024-12-20T00:00:00.000Z'
          }
        })
      })
    ]

    const viewModel = new ViewModel(summaryCdos, counts, 'due', sort, backNav)

    expect(viewModel.model.tab).toBe('due')
    expect(viewModel.model.tableHeadings[3]).toEqual({
      label: 'Not received',
      link: undefined,
      ariaSort: undefined
    })
    expect(viewModel.model.resultList[0].notReceived).toEqual([
      APPLICATION_PACK,
      INSURANCE,
      APPLICATION_FEE
    ])
    expect(viewModel.model.resultList[1].notReceived).toEqual([
      INSURANCE,
      APPLICATION_FEE
    ])
    expect(viewModel.model.resultList[2].notReceived).toEqual([INSURANCE])
    expect(viewModel.model.resultList[3].notReceived).toEqual([FORM_2])
    expect(viewModel.model.resultList[4].notReceived).toEqual([])
  })
})
