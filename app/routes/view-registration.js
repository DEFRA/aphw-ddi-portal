module.exports = {
  method: 'GET',
  path: '/view-registration',
  handler: (request, h) => {
    return h.view('view-registration')
  }
}
