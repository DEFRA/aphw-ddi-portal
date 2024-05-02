function ViewModel (activities) {
  this.model = {
    dogSent: activities.dogSent,
    dogReceived: activities.dogReceived,
    ownerSent: activities.ownerSent,
    ownerReceived: activities.ownerReceived
  }
}

module.exports = ViewModel
