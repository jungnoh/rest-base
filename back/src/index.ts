import express from 'express';
import expressSession from 'express-session';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';

import router from './routes';
import {handleError} from './middlewares/error';

async function setup(isDev: boolean) {
  if (isDev) {
    console.log('Running in development mode');
  }
  try {
  } catch (err) {
    throw err;
  }
}

export default async function createApp(isDev = false) {
  // Set configs
  await setup(isDev);
  const app = express();
  // Express session
  app.use(expressSession({
    cookie: {
      httpOnly: false, // Client-side XHR will be used
      maxAge: 24 * 60 * 60 * 1000 // 1 day
    },
    resave: false,
    saveUninitialized: false,
    secret: process.env.SESSION_SECRET!,
    // store:  TODO: Add mysql store
  }));

  app.use(helmet());
  // app.use(morgan('dev'));
  // Parsers
  app.use(express.json());
  app.use(express.urlencoded({extended: true}));
  app.use(cookieParser());
  // Routes
  app.use(router);
  // Error handling
  app.use(handleError);
  app.all('*', (_, res) => {
    res.status(404).json({success: false});
  });
  // All set!
  return app;
}
