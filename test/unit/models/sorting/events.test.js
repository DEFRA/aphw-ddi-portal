const { sortEventsDesc, sortEventsDescCompareFn } = require('../../../../app/models/sorting/event')
describe('Event sorting', () => {
  const activityPoliceEarly = {
    activity: {
      activityDate: '2024-02-15T00:00:00.000Z'
    },
    subject: 'DDI Activity Police correspondence',
    timestamp: '2024-02-14T15:12:41.937Z',
    type: 'uk.gov.defra.ddi.event.activity'
  }
  const activityPolice = {
    activity: {
      activityDate: '2024-02-14T00:00:00.000Z'
    },
    subject: 'DDI Activity Police correspondence',
    timestamp: '2024-02-14T16:12:41.937Z',
    type: 'uk.gov.defra.ddi.event.activity'
  }
  const activityPolice2 = {
    activity: {
      activityDate: '2024-02-14T00:00:00.000Z'
    },
    subject: 'DDI Activity Police correspondence',
    timestamp: '2024-02-14T15:12:41.937Z',
    type: 'uk.gov.defra.ddi.event.activity'
  }
  const activityJudicial = {
    activity: {
      activityDate: '2024-02-13T00:00:00.000Z'
    },
    subject: 'DDI Activity Judicial review notice',
    timestamp: '2024-02-15T15:12:41.937Z',
    type: 'uk.gov.defra.ddi.event.activity'
  }
  const createCdo = {
    timestamp: '2024-02-14T08:24:22.487Z',
    type: 'uk.gov.defra.ddi.event.create',
    subject: 'DDI Create cdo'
  }
  const updatePerson = {
    timestamp: '2024-02-14T08:23:22.301Z',
    type: 'uk.gov.defra.ddi.event.update',
    subject: 'DDI Update person'
  }
  const updateDog = {
    timestamp: '2024-02-14T08:22:52.441Z',
    type: 'uk.gov.defra.ddi.event.update',
    subject: 'DDI Update dog'
  }

  describe('sortEventsDescCompareFn', () => {
    test('should sort two none activities correctly', () => {
      expect(sortEventsDescCompareFn(updatePerson, updateDog) < 0).toBe(true)
      expect(sortEventsDescCompareFn(updateDog, updatePerson) > 0).toBe(true)
      const mappedResults = [updateDog, updatePerson].sort(sortEventsDescCompareFn)
      expect(mappedResults).toEqual([updatePerson, updateDog])
    })

    test('should sort two activities correctly', () => {
      expect(sortEventsDescCompareFn(activityPoliceEarly, activityPolice2) < 0).toBe(true)
      expect(sortEventsDescCompareFn(activityPolice2, activityPoliceEarly) > 0).toBe(true)
      const mappedResults = [activityPolice2, activityPoliceEarly].sort(sortEventsDescCompareFn)
      expect(mappedResults).toEqual([activityPoliceEarly, activityPolice2])
    })

    test('should sort two activities correctly given same date', () => {
      expect(sortEventsDescCompareFn(activityPolice, activityPolice2) < 0).toBe(true)
      expect(sortEventsDescCompareFn(activityPolice2, activityPolice) > 0).toBe(true)
      const mappedResults = [activityPolice2, activityPolice].sort(sortEventsDescCompareFn)
      expect(mappedResults).toEqual([activityPolice, activityPolice2])
    })

    test('should sort two activities correctly given different types', () => {
      expect(sortEventsDescCompareFn(createCdo, activityJudicial) < 0).toBe(true)
      expect(sortEventsDescCompareFn(activityJudicial, createCdo) > 0).toBe(true)
      const mappedResults = [activityJudicial, createCdo].sort(sortEventsDescCompareFn)
      expect(mappedResults).toEqual([createCdo, activityJudicial])
    })

    test('should sort two activities correctly given Date is same', () => {
      const firstItem = {
        activity: {
          activityDate: '2024-02-14T00:00:00.000Z'
        },
        subject: 'DDI Activity Police correspondence',
        timestamp: '2024-02-14T16:13:41.937Z',
        type: 'uk.gov.defra.ddi.event.activity'
      }
      const secondItem = {
        activity: {
          activityDate: '2024-02-14T00:00:00.000Z'
        },
        subject: 'DDI Activity Police correspondence',
        timestamp: '2024-02-14T16:12:41.937Z',
        type: 'uk.gov.defra.ddi.event.activity'
      }
      expect(sortEventsDescCompareFn(firstItem, secondItem) < 0).toBe(true)
      expect(sortEventsDescCompareFn(secondItem, firstItem) > 0).toBe(true)
      const mappedResults = [secondItem, firstItem].sort(sortEventsDescCompareFn)
      expect(mappedResults).toEqual([firstItem, secondItem])
    })
  })

  describe('sortEventsDesc', () => {
    const events = [
      updatePerson,
      activityPolice,
      activityPolice2,
      activityPoliceEarly,
      updateDog,
      activityJudicial,
      createCdo
    ]

    const expectedOrder = [
      activityPoliceEarly,
      createCdo,
      updatePerson,
      updateDog,
      activityPolice,
      activityPolice2,
      activityJudicial
    ]

    expect(sortEventsDesc(events)).toEqual(expectedOrder)
  })
})
