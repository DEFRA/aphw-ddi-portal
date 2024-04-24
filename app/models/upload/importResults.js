function ViewModel (results, errors) {
  this.model = {
    logRows: results?.log,
    confirm: {
      id: 'confirm',
      name: 'confirm',
      items: [
        {
          value: 'Y',
          text: 'Are you sure you want to save these records to the database?'
        }
      ]
    },
    errors: []
  }

  if (errors) {
    this.model.confirm.errorMessage = { text: 'Check the box to confirm' }
    this.model.errors.push({ text: 'Check the box to confirm', href: '#confirm' })
  }
}

module.exports = ViewModel
