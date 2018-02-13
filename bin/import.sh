#!/bin/sh
echo 'Verifying Heroku Mongo URI...'
MONGODB_URI=`heroku config:get MONGODB_URI`
if [[ -z "${MONGODB_URI}" ]]; then
    echo 'Error: heroku MONGODB_URI is not defined';
    echo '       Run heroku addons:create mongolab:sandbox to create a free database'
    exit 1
fi
MONGO_DATABASE=${MONGODB_URI##*/}

echo 'Downloading database backup...'
PREVIOUS_DIR=`pwd`
TMP_DIR=`mktemp -d 2>/dev/null || mktemp -d -t 'mongotmp'`
cd $TMP_DIR
curl -L -o restaurants.bson.gz https://www.dropbox.com/s/17mf63d0y3ky76z/restaurants.bson.gz?dl=1
curl -L -o restaurants.metadata.json.gz https://www.dropbox.com/s/fzyyo875u0k7wih/restaurants.metadata.json.gz?dl=1
echo ''

echo 'Running mongorestore...'
mongorestore --uri $MONGODB_URI --collection restaurants --gzip restaurants.bson.gz --db $MONGO_DATABASE

cd $PREVIOUS_DIR
rm -rf TMP_DIR

echo 'Done!'
