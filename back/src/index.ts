import express from 'express';
import expressSession from 'express-session';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import winston from 'winston';
import router from './routes';
import {handleError} from './middlewares/error';
import { createConnection, getRepository } from 'typeorm';
import { TypeormStore } from 'connect-typeorm/out';
import { SessionEntity } from './models/session';
import passport from 'passport';
import * as PassportStrategy from './util/passport';

async function setup(isDev: boolean) {
  if (isDev) {
    winston.info('Running in development mode');
    await createConnection();
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
    store: new TypeormStore({
      cleanupLimit: 2,
      limitSubquery: false,
      ttl: 86400
    }).connect(getRepository(SessionEntity))
  }));

  app.use(helmet());
  // app.use(morgan('dev'));
  // Parsers
  app.use(express.json());
  app.use(express.urlencoded({extended: true}));
  app.use(cookieParser());
  // Passport
  app.use(passport.initialize());
  app.use(passport.session());
  passport.use(PassportStrategy.localStrategy);
  passport.serializeUser(PassportStrategy.serialize);
  passport.deserializeUser(PassportStrategy.deserialize);
  app.use((req, _, next) => {
    if (!req.session?.passport || JSON.stringify(req.session.passport) === '{}') {
      req.user = undefined;
    }
    next();
  });
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
