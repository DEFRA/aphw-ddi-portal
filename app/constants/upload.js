const upload = {
  routes: {
    importXlb: {
      get: '/upload/import-xlb',
      post: '/upload/import-xlb'
    },
    importValidation: {
      get: '/upload/import-validation',
      post: '/upload/import-validation'
    },
    importResults: {
      get: '/upload/import-results',
      post: '/upload/import-results'
    },
    importCompleted: {
      get: '/upload/import-completed',
      post: '/upload/import-completed'
    }
  },
  views: {
    importXlb: 'upload/import-xlb',
    importValidation: 'upload/import-validation',
    importResults: 'upload/import-results',
    importCompleted: 'upload/import-completed'
  },
  keys: {
    importValidationResults: 'import-validation-results',
    importFilename: 'import-filename',
    importLog: 'import-log',
    finalImportLog: 'final-import-log'
  },
  stages: {
    spreadsheetValidation: 'spreadsheet-validation',
    importValidation: 'import-validation',
    saveToDb: 'save-to-db'
  }
}

module.exports = upload
