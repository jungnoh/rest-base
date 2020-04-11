import MongoStore from 'connect-mongo';
import express, { Request } from 'express';
import expressSession from 'express-session';
import helmet from 'helmet';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import winston from 'winston';
import router from 'routes';
import {handleError} from 'middlewares/error';
import passport from 'passport';
import * as PassportStrategy from 'util/passport';
import { init as initServices } from 'services';

async function setup(isDev: boolean) {
  if (isDev) {
    winston.info('Running in development mode');
  }
  if (process.env.MONGO_HOST === undefined) {
    winston.error('MONGO_HOST not found');
    process.exit(1);
  }
  if (process.env.SESSION_SECRET === undefined) {
    winston.error('SESSION_SECRET not found');
    process.exit(1);
  }
  const mongooseConfig: mongoose.ConnectionOptions = {
    useCreateIndex: true,
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true
  };
  await mongoose.connect(process.env.MONGO_HOST, mongooseConfig);
  winston.info('Connected to mongodb');
  await initServices();
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
    store: new (MongoStore(expressSession))({
      mongooseConnection: mongoose.connection
    })
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
