const ViewModel = require('../../../../../app/models/cdo/edit/send-certificate')
const { buildCdo, buildCdoDog, buildCdoPerson, buildCdoPersonContact, buildCdoPersonContactContact } = require('../../../../mocks/cdo/cdo')
const { buildBackNav } = require('../../../../mocks/backnav')
describe('send-certificate model', () => {
  test('should work with default values', () => {
    const cdo = buildCdo({
      dog: buildCdoDog({
        status: 'Interim exempt',
        indexNumber: 'ED12345'
      }),
      person: buildCdoPerson({
        person_contacts: [buildCdoPersonContact({
          contact: buildCdoPersonContactContact({
            contact: 'bilbo.baggins@shire.co.uk'
          })
        })]
      })
    })
    const payload = {}
    const backNav = buildBackNav()
    const model = new ViewModel(cdo, true, payload, backNav)

    expect(model.model).toEqual({
      backLink: '/',
      srcHashParam: '?src=src-hash-param',
      indexNumber: 'ED12345',
      titleText: 'How do you want to send the certificate of exemption?',
      sendOption: {
        id: 'sendOption',
        name: 'sendOption',
        items: [
          {
            value: 'email',
            html: 'Email it to:<p class="govuk-!-margin-top-1 govuk-!-margin-bottom-0">bilbo.baggins@shire.co.uk</p>'
          },
          {
            value: 'post',
            text: 'Post it'
          }
        ],
        autocomplete: 'one-time-code',
        classes: 'defra-responsive-!-font-size-16',
        value: 'email'
      },
      errors: []
    })
  })

  test('should work with no email', () => {
    const cdo = buildCdo({
      dog: buildCdoDog({
        status: 'Interim exempt',
        indexNumber: 'ED12345'
      }),
      person: buildCdoPerson({
        person_contacts: []
      })
    })
    const payload = {}
    const backNav = buildBackNav()
    const model = new ViewModel(cdo, true, payload, backNav)

    expect(model.model).toEqual({
      backLink: '/',
      srcHashParam: '?src=src-hash-param',
      indexNumber: 'ED12345',
      titleText: 'How do you want to send the certificate of exemption?',
      sendOption: {
        id: 'sendOption',
        name: 'sendOption',
        items: [
          {
            text: 'Email',
            value: 'email',
            conditional: {
              type: 'email',
              html: '<div class="govuk-form-group">' +
                  '    <label class="govuk-label" for="new-email">\n' +
                  '      Email address' +
                  '    </label>' +
                  '    <div id="event-name-hint" class="govuk-hint">' +
                  '      Enter the dog owner’s email address.' +
                  '    </div>' +
                  '    <input class="govuk-input govuk-!-width-two-thirds" name="email" type="email" value="">' +
                  '    <input name="updateEmail" type="hidden" value="true">' +
                  '  <div></div><div></div></div>'
            }
          },
          {
            value: 'post',
            text: 'Post it'
          }
        ],
        autocomplete: 'one-time-code',
        classes: 'defra-responsive-!-font-size-16',
        value: 'email'
      },
      errors: []
    })
  })
})
