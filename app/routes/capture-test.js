module.exports = {
  method: 'GET',
  path: '/capture-test',
  handler: (request, h) => {
    return h.view('register/owner/_capture-test')
  }
}
