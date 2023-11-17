jest.mock('ffc-messaging')
const { MessageSender } = require('ffc-messaging')

const { sendMessage } = require('../../../app/messaging/outbound')

describe('register import message sender', () => {
  test('should send message', async () => {
    const data = {
      filename: 'test.xlsx',
      email: 'test@example.com'
    }

    await sendMessage(data)

    expect(MessageSender).toHaveBeenCalledTimes(1)
    expect(MessageSender.prototype.sendMessage).toHaveBeenCalledWith({
      body: {
        specVersion: '1.0',
        id: expect.any(String),
        time: expect.any(String),
        subject: 'RegisterImport',
        dataContentType: 'text/json',
        data
      },
      type: 'REGISTER_IMPORT',
      source: 'aphw-ddi-portal'
    })
    expect(MessageSender.prototype.closeConnection).toHaveBeenCalled()
  })
})
