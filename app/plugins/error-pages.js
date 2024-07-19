/*
* Add an `onPreResponse` listener to return error pages
*/

module.exports = {
  plugin: {
    name: 'error-pages',
    register: (server, options) => {
      server.ext('onPreResponse', (request, h) => {
        const response = request.response

        console.log('error-pages1')
        if (response.isBoom) {
          // An error was raised during
          // processing the request
          console.log('error-pages2')
          const statusCode = response.output.statusCode
          console.log('error-pages3', statusCode)

          // if not authorised then request login
          if (statusCode === 401 || statusCode === 403) {
            return h.view('unauthorized').code(statusCode)
          }

          console.log('error-pages4')
          // In the event of 404
          // return the `404` view
          if (statusCode === 404) {
            return h.view('404').code(statusCode)
          }

          console.log('error-pages5')
          request.log('error', {
            statusCode,
            data: response.data,
            message: response.message
          })

          console.log('error-pages6')
          // The return the `500` view
          return h.view('500').code(statusCode)
        }
        return h.continue
      })
    }
  }
}
