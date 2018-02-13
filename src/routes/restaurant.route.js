import express from 'express';
import RestaurantController from '../controllers/restaurant.controller';

const router = express.Router();

router.route('/').get(RestaurantController.list);
router.route('/descriptions').get(RestaurantController.descriptions);

export default router;
