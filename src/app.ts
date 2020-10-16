import path from 'path';

import express, { Express, Request, Response } from 'express';

// Database
import db from './database';

// Web push handler
import * as webpush from './webpush-handler';

// User provided config
import config from './config';

// Home controller
import * as homeController from './controllers/home';

// Route handlers
import notificationsRouter from './routers/notifications';

// Custom middleware
import { requestLogger, corsMiddleware } from './middleware';

// Custom Types/Interfaces
import { AppExtras } from './types/app-extras';

// Directory paths
const ROOT_DIR = path.dirname(__dirname);
const ASSETS_DIR = path.join(ROOT_DIR, 'assets');
const VIEWS_DIR = path.join(ASSETS_DIR, 'views');
const STATICS_DIR = path.join(ASSETS_DIR, 'public');

// Initiallize database setup
db.init().catch(e => {
    // Failed setting up DB
    console.error(e);
    process.exit(1);
});

// Create Express server
const app: Express & AppExtras = express();

// Express configuration
app.set('port', config.PORT);
app.set('env', config.ENV);
app.set('views', VIEWS_DIR);
app.set('view engine', 'EJS');

// Link static files
app.use(express.static(STATICS_DIR));

// Middlewares
// Log requests and responses
app.use(requestLogger);
// Register a cors middleware
app.use(corsMiddleware);

// Set extra properties on app that the templating engine can access
app.locals.name = config.NAME;
app.locals.PUBLIC_VAPID_KEY = config.PUBLIC_VAPID_KEY;

// Initiallize the web push setup
webpush.setUpVAPID();

// Set up primary app routes
app.get('/', homeController.index);
app.use('/', notificationsRouter);

// 404 Route
app.get('*', (req: Request, res: Response) => {
    res.status(404).send('Page Not Found');
});

export default app;
