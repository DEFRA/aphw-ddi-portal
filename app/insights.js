const appInsights = require('applicationinsights')

const setup = () => {
  if (process.env.APPLICATIONINSIGHTS_CONNECTION_STRINGxx) {
    appInsights.setup().start()
    console.log('App Insights Running')
    const cloudRoleTag = appInsights.defaultClient.context.keys.cloudRole
    const appName = process.env.APPINSIGHTS_CLOUDROLE
    appInsights.defaultClient.context.tags[cloudRoleTag] = appName
  } else {
    console.log('App Insights Not Running!')
  }
}

module.exports = { setup }
