# aphw-ddi-portal
 
Web frontend to support the dangerous dog index.

## Prerequisites

- Docker
- Docker Compose

Optional:
- Kubernetes
- Helm

## Running the application

The application is designed to run in containerised environments, using Docker Compose in development and Kubernetes in production.

- A Helm chart is provided for production deployments to Kubernetes.

### Build container image

Container images are built using Docker Compose, with the same images used to run the service with either Docker Compose or Kubernetes.

When using the Docker Compose files in development the local `app` folder will
be mounted on top of the `app` folder within the Docker container, hiding the CSS files that were generated during the Docker build.  For the site to render correctly locally `npm run build` must be run on the host system.


By default, the start script will build (or rebuild) images so there will
rarely be a need to build images manually. However, this can be achieved
through the Docker Compose
[build](https://docs.docker.com/compose/reference/build/) command:

```
# Build container images
docker-compose build
```

### Authentication

You will need to create a private and public key and add to your environment variables.  

First create the private and public keys:

```shell
openssl genrsa -out private_key.pem 2048
openssl rsa -pubout -in private_key.pem -out public_key.pem
```

You will then need to base64 encode the private and public keys to use in env variables:

```shell
# copy each of the keys then in OSX:
pbpaste | base64 | pbcopy
# add to 
```

### Start 

Use Docker Compose to run service locally.

```
docker-compose up
```

## Test structure

The tests have been structured into subfolders of `./test` as per the
[Microservice test approach and repository structure](https://eaflood.atlassian.net/wiki/spaces/FPS/pages/1845396477/Microservice+test+approach+and+repository+structure)

## Swagger

When running locally or in non-production environments, you can view swagger documentation from the api on /documentation.

### Running tests

A convenience script is provided to run automated tests in a containerised
environment. This will rebuild images before running tests via docker-compose,
using a combination of `docker-compose.yaml` and `docker-compose.test.yaml`.
The command given to `docker-compose run` may be customised by passing
arguments to the test script.

Examples:

```
# Run all tests
scripts/test

# Run tests with file watch
scripts/test -w
```

# Running a subset of tests outside of Docker
In order to run a single test or group of tests, you can use
```
npm run test <path>/<filename> 
```
e.g.
```
npm run test owner.test.js
```

However, you will need to copy these lines into your jest.setup.js temporarily, and do not check in any changes to jest.setup.js 

```
process.env.COOKIE_PASSWORD = 'cookiepasswordcookiepasswordcookiepassword'
process.env.AZURE_STORAGE_ACCOUNT_NAME = 'devstoreaccount1'
process.env.AZURE_STORAGE_CONNECTION_STRING = 'DefaultEndpointsProtocol=http;AccountName=devstoreaccount1;AccountKey=Eby8vdM02xNOcqFlqUwJPLlmEtlCDXJ1OUzFT50uSRZ6IFsuFq2UVErCz4I6tq/K1SZFPTOtr/KBHBeksoGMGw==;BlobEndpoint=http://host.docker.internal:10000/devstoreaccount1;'
process.env.DDI_API_BASE_URL = 'http://localhost/api'
process.env.DDI_EVENTS_BASE_URL = 'http://localhost/events'
process.env.OS_PLACES_API_BASE_URL = 'http://localhost/os-places'
process.env.OS_PLACES_API_KEY = 'some-api-key'
process.env.POLICE_API_BASE_URL = 'http://localhost/police'
```

alternatively, you could add `--setupFilesAfterEnv=<rootDir>/jest.setup.single.js` to your jest arguments:

```
npm run test <path>/<filename> -- --setupFilesAfterEnv=<rootDir>/jest.setup.single.js
```



## Pact Broker

To test pact locally you will need to download the pact-broker cli: https://github.com/pact-foundation/pact-ruby-standalone/releases
There are two scripts, one to start up the Pact Broker, the other to publish the pact contracts.

## CI pipeline

This service uses the [FFC CI pipeline](https://github.com/DEFRA/ffc-jenkins-pipeline-library)

## Licence

THIS INFORMATION IS LICENSED UNDER THE CONDITIONS OF THE OPEN GOVERNMENT LICENCE found at:

<http://www.nationalarchives.gov.uk/doc/open-government-licence/version/3>

The following attribution statement MUST be cited in your products and applications when using this information.

> Contains public sector information licensed under the Open Government license v3

### About the licence

The Open Government Licence (OGL) was developed by the Controller of Her Majesty's Stationery Office (HMSO) to enable information providers in the public sector to license the use and re-use of their information under a common open licence.

It is designed to encourage use and re-use of information freely and flexibly, with only a few conditions.