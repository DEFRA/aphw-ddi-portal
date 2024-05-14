const exportData = {
  routes: {
    export: {
      get: '/export',
      post: '/export'
    },
    exportCreateFile: {
      get: '/export-create-file'
    }
  },
  views: {
    export: 'export/export-data'
  }
}

module.exports = exportData
