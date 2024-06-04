describe('cookies.js', () => {
  const { getCurrentPolicy, updatePolicy } = require('../../app/cookies')
  const cookiesPolicy = { confirmed: true, essential: true, analytics: true }
  const request = {
    state: {
      cookies_policy: cookiesPolicy
    }
  }

  describe('getCurrentPolicy', () => {
    test('entry point starts server', () => {
      const result = getCurrentPolicy(request)
      expect(result).toEqual(cookiesPolicy)
    })
  })

  describe('updatePolicy', () => {
    const h = {
      state: jest.fn(),
      unstate: jest.fn()
    }
    updatePolicy(request, h, false)

    expect(h.state).toHaveBeenCalledWith('cookies_policy', { confirmed: true, essential: true, analytics: false }, expect.anything())
    expect(h.unstate).toHaveBeenCalledWith('_ga')
    expect(h.unstate).toHaveBeenCalledWith('_gid')
  })
})
