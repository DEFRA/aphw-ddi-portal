const exportData = {
  routes: {
    export: {
      get: '/export',
      post: '/export'
    },
    triggerOvernight: {
      get: '/trigger-overnight'
    }
  },
  views: {
    export: 'export/export-data'
  }
}

module.exports = exportData
