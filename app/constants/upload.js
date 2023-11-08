const upload = {
  routes: {
    register: {
      get: '/upload/register',
      post: '/upload/register'
    }
  },
  views: {
    register: 'upload/register/upload-register'
  }
}

module.exports = upload
