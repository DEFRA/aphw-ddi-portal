const { sortEventsDesc, sortEventsDescCompareFn, filterEvents } = require('../../../../app/models/sorting/event')
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

  const changeOwnerEvents = {
    events: [
      {
        operation: 'changed dog owner',
        details: 'Dog ED123 moved from Peter Snow',
        timestamp: '2024-05-24T12:16:05.812Z',
        type: 'uk.gov.defra.ddi.event.change.owner',
        rowKey: '7809b93e-8920-4138-9e83-ae192e4d71cf|1716552966176',
        subject: 'DDI Changed Dog Owner'
      },
      {
        operation: 'changed dog owner',
        details: 'Dog ED111 moved from Peter Snow',
        timestamp: '2024-05-24T12:16:05.812Z',
        type: 'uk.gov.defra.ddi.event.change.owner',
        rowKey: '7809b93e-8920-4138-9e83-ae192e4d71cf|1716552966176',
        subject: 'DDI Changed Dog Owner'
      },
      {
        operation: 'changed dog owner',
        details: 'Owner changed from Peter Snow',
        timestamp: '2024-05-24T12:16:05.812Z',
        type: 'uk.gov.defra.ddi.event.change.owner',
        rowKey: '7809b93e-8920-4138-9e83-ae192e4d71cf|1716552966176',
        subject: 'DDI Changed Dog Owner'
      }
    ]
  }

  describe('filterEvents', () => {
    test('should exclude any dog change owner events that are for a different dog to the one specified', () => {
      const config = {
        pk: 'ED123',
        source: 'dog'
      }
      const filteredEvents = filterEvents(changeOwnerEvents, config)
      expect(filteredEvents.length).toBe(2)
      expect(filteredEvents[0].details).toBe('Dog ED123 moved from Peter Snow')
      expect(filteredEvents[1].details).toBe('Owner changed from Peter Snow')
    })

    test('should include all events for the owner', () => {
      const config = {
        pk: 'P-123',
        source: 'owner'
      }
      const filteredEvents = filterEvents(changeOwnerEvents, config)
      expect(filteredEvents.length).toBe(3)
      expect(filteredEvents[0].details).toBe('Dog ED123 moved from Peter Snow')
      expect(filteredEvents[1].details).toBe('Dog ED111 moved from Peter Snow')
      expect(filteredEvents[2].details).toBe('Owner changed from Peter Snow')
    })
  })
})
