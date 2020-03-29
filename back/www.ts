// MUST setup before running/importing anything
import dotenv from 'dotenv';
dotenv.config();
import './src/logger';
import createApp from './src';

// import fs from 'fs';
import http from 'http';

createApp(process.env.NODE_ENV === 'development').then((app) => {
  const httpServer = http.createServer(app);
  httpServer.listen(8080);
});
