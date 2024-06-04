/* istanbul ignore file */

jest.setTimeout(30000)
process.env.COOKIE_PASSWORD = 'cookiepasswordcookiepasswordcookiepassword'
process.env.AZURE_STORAGE_ACCOUNT_NAME = 'devstoreaccount1'
process.env.AZURE_STORAGE_CONNECTION_STRING = 'DefaultEndpointsProtocol=http;AccountName=devstoreaccount1;AccountKey=Eby8vdM02xNOcqFlqUwJPLlmEtlCDXJ1OUzFT50uSRZ6IFsuFq2UVErCz4I6tq/K1SZFPTOtr/KBHBeksoGMGw==;BlobEndpoint=http://host.docker.internal:10000/devstoreaccount1;'
process.env.DDI_API_BASE_URL = 'http://localhost/api'
process.env.DDI_EVENTS_BASE_URL = 'http://localhost/events'
process.env.OS_PLACES_API_BASE_URL = 'http://localhost/os-places'
process.env.OS_PLACES_API_KEY = 'some-api-key'
process.env.POLICE_API_BASE_URL = 'http://localhost/police'
