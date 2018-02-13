import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import RestaurantRoute from './routes/restaurant.route';

const app = express();

const PORT = process.env.PORT || 3000;

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/health';

app.listen(PORT, () => console.log(`Express server started on port ${PORT}`));

(async function() {
  await mongoose.connect(MONGODB_URI);
})();

app.set('json spaces', 2);
app.use(cors());
app.use('/api/v1/restaurants', RestaurantRoute);
