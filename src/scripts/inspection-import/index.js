import * as request from 'request';
import parse from 'csv-parse';
import mongoose from 'mongoose';

import Restaurant from '../../models/restaurant.model';

const DATA_URL = 'https://nycopendata.socrata.com/api/views/xx67-kt59/rows.csv?accessType=DOWNLOAD';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/health';

(async function() {
  const goose = await mongoose.connect(MONGODB_URI);

  request.get(DATA_URL)
    .pipe(parse({from: 2}))
    .on('data', async (data) => {
      try {
        await Restaurant.fromRow(data).upsert();
      } catch(e) {
        console.log(e);
      }
    })
    .on('end', () => {
      goose.disconnect();
      console.log('end!');
    });

}());
