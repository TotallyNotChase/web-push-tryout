import express from 'express';

// Custom middleware
import { bodyParser } from '../middleware';

// Route controllers
import * as notificationsController from '../controllers/notifications';

const router = express.Router();

// Add controllers, as well as necessary middleware to the routes
router
    .route('/subscriptions')
    .put(bodyParser, notificationsController.subscribe)
    .delete(bodyParser, notificationsController.unsubscribe);
router
    .route('/notification')
    .get(notificationsController.send);

export default router;
