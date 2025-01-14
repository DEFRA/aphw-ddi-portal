
const ViewModel = require('../../../../../../app/models/cdo/manage/tasks/send-application-pack-2')
const { notYetStartedTaskList } = require('../../../../../mocks/cdo/manage/tasks/not-yet-started')
describe('send-application-pack-2', () => {
  test('should return undefined on email if is null', () => {
    /**
     * @type {CdoTaskListDto}
     */
    const taskListDto = {
      ...notYetStartedTaskList,
      taskName: 'send-application-pack-2',
      task: {
        completed: false
      },
      indexNumber: 'ED300001',
      cdoSummary: {
        person: {
          firstName: 'Garry',
          lastName: 'McFadyen',
          email: null,
          addressLine1: '221b, Baker Street',
          addressLine2: '',
          town: 'London',
          postcode: 'NW1 6XE'
        }
      }
    }

    const backNav = {
      backLink: '/',
      srcHashParam: '?src=9f56-29eb'
    }

    const model = new ViewModel(taskListDto, backNav)
    expect(model.model).toEqual({
      backLink: '/cdo/manage/cdo/ED300001',
      continueLink: '/cdo/manage/cdo/ED300001?action=continue',
      indexNumber: 'ED300001',
      srcHashParam: '?src=9f56-29eb',
      errors: [],
      person: {
        firstName: 'Garry',
        lastName: 'McFadyen',
        email: null,
        addressLine1: '221b, Baker Street',
        addressLine2: '',
        town: 'London',
        postcode: 'NW1 6XE'
      },
      taskName: 'send-application-pack-2',
      disabled: false,
      taskDone: {
        id: 'taskDone',
        name: 'taskDone',
        items: [
          {
            value: 'Y',
            text: 'I have sent the application pack',
            checked: false,
            disabled: false
          }
        ]
      },
      contact: {
        name: 'contact',
        items: [
          {
            text: 'Email',
            value: 'email',
            conditional: {
              html: '<div class="govuk-form-group">' +
                '    <label class="govuk-label" for="new-email">\n' +
                '      Email address' +
                '    </label>' +
                '    <div id="event-name-hint" class="govuk-hint">' +
                '      Enter the dog owner’s email address.' +
                '    </div>' +
                '    <input class="govuk-input govuk-!-width-two-thirds" name="email" type="email">' +
                '    <input name="updateEmail" type="hidden" value="true">' +
                '  <div></div><div></div></div>'
            }
          },
          {
            html: 'Post it to:<p class="govuk-!-margin-top-1 govuk-!-margin-bottom-0">Garry McFadyen<br>221b, Baker Street<br>London<br>NW1 6XE</p>',
            value: 'post'
          }
        ]
      }
    })
  })

  test('should return undefined if is empty', () => {
    /**
     * @type {CdoTaskListDto}
     */
    const taskListDto = {
      ...notYetStartedTaskList,
      taskName: 'send-application-pack-2',
      task: {
        completed: false
      },
      indexNumber: 'ED300001',
      cdoSummary: {
        person: {
          firstName: 'Garry',
          lastName: 'McFadyen',
          email: '',
          addressLine1: '221b, Baker Street',
          addressLine2: '',
          town: 'London',
          postcode: 'NW1 6XE'
        }
      }
    }

    const backNav = {
      backLink: '/cdo/manage/cdo/ED300001',
      srcHashParam: '?src=9f56-29eb'
    }

    const model = new ViewModel(taskListDto, backNav)
    expect(model.model).toEqual({
      backLink: '/cdo/manage/cdo/ED300001',
      srcHashParam: '?src=9f56-29eb',
      continueLink: '/cdo/manage/cdo/ED300001?action=continue',
      errors: [],
      indexNumber: 'ED300001',
      person: {
        firstName: 'Garry',
        lastName: 'McFadyen',
        email: '',
        addressLine1: '221b, Baker Street',
        addressLine2: '',
        town: 'London',
        postcode: 'NW1 6XE'
      },
      taskName: 'send-application-pack-2',
      disabled: false,
      taskDone: {
        id: 'taskDone',
        name: 'taskDone',
        items: [
          {
            value: 'Y',
            text: 'I have sent the application pack',
            checked: false,
            disabled: false
          }
        ]
      },
      contact: {
        name: 'contact',
        items: [
          {
            text: 'Email',
            value: 'email',
            conditional: {
              html: '<div class="govuk-form-group">' +
                '    <label class="govuk-label" for="new-email">\n' +
                '      Email address' +
                '    </label>' +
                '    <div id="event-name-hint" class="govuk-hint">' +
                '      Enter the dog owner’s email address.' +
                '    </div>' +
                '    <input class="govuk-input govuk-!-width-two-thirds" name="email" type="email">' +
                '    <input name="updateEmail" type="hidden" value="true">' +
                '  <div></div><div></div></div>'
            }
          },
          {
            html: 'Post it to:<p class="govuk-!-margin-top-1 govuk-!-margin-bottom-0">Garry McFadyen<br>221b, Baker Street<br>London<br>NW1 6XE</p>',
            value: 'post'
          }
        ]
      }
    })
  })
})
