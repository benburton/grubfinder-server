# grubfinder-server
[![Logo](logo.png)](logo.png)

This is a server for the GrubFinder application, whose purpose is to aggregate all grading and reporting for New York
City restaurants and to display them in a digestible (heh) way. You can find the corresponding `grubfinder-client` code
[over here](https://github.com/benburton/grubfinder-client).

## Development

### Dependencies

You will need the following dependencies installed in order to run the application locally:

- [Node.js](https://nodejs.org/)
- [MongoDB](https://docs.mongodb.com/manual/installation/)

### Installation

Run the `npm` install target:

```
npm install
```

This will also run `postinstall` to convert from es2015.

### Local Development

Use the `start` target of `npm`:

```
npm start
```
This will start the local Express server at [http://localhost:3000](http://localhost:3000)

### Running Tests

```
npm test
```

## Deployment

This project is configured to run on [Heroku](https://www.heroku.com/). See the [Heorku](docs/heroku.md) documentation for 
more information.

### Dependencies

- [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli)

### Git Setup

Run

```
heroku create
```

to generate a new Heroku application. This will also add the `heroku` git remote repository to your configuration:

```
$ git remote -v
heroku	https://git.heroku.com/grubfinder-api.git (fetch)
heroku	https://git.heroku.com/grubfinder-api.git (push)
origin	git@github.com:benburton/grubfinder-server.git (fetch)
origin	git@github.com:benburton/grubfinder-server.git (push)
```

### Heroku Environment Setup

Add `NPM_CONFIG_PRODUCTION=false` so that Heroku will install development dependencies as well:
```
heroku config:set NPM_CONFIG_PRODUCTION=false
```

### Install MongoLab Sandbox plugin

`grubfinder-server` utilizes MongoDB as its data store. I'm not happy about this, for more than a few reasons. Add the
MongoLab sandbox addon to get a MongoDB instance running quickly and (relatively) painlessly:

```
heroku addons:create mongolab:sandbox
```

You may need to wait ~30 minutes for an instance to spin up.

### Run the NYSDOH Data Import

If you set the `MONGODB_URI` to the same value as the `MONGODB_URI` Heroku environment variable, you should be able to
run the import from your local machine onto your Heroku instance using the following:

```
npm run inspection-import
```

Note that this is particularly slow, as the nature of the data and the speed of import is not friendly to keeping writes
off the same records a very long duration of time. As a workaround, I introduced some rudimentary pessimistic locking 
using [async-lock](https://github.com/rogierschouten/async-lock). It's not a pretty solution, but it does get the job 
done. Or:

### Import NYSDOH Data from Backup

I've also made a backup on Dropbox, and included a script to pull it down and migrate into a Heroku environment using
`mongoimport`:
```
bin/import.sh
```

### Push

You should simply be able to run

```git push heroku master```

for a working deployment to your Heroku application.

# TODOs

## Development
- Add a file watcher to hot-reload code changes for easier development

## General REST cleanup
- Add Swagger documentation
- Redirect pages for 404s
- Better/clearer 500 handling
- Add routes for processing data import over REST

## Testing
- Jasmine unit tests that work `async`/`await` keywords for controllers
- Improve overall test coverage
- Load testing

## Schema/Database Cleanup
- Move from MongoDB to Postgres. I should have started the project this way :weary:
- Remove blank/inconsistent records
- Better data sanitization

## Devops
- Consider putting the project into Docker for easier deployment
- Add more verbose logging

## Features
- Add geocoding to addresses from NYSDOH so the frontend can use Google Maps
