import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import next from 'next';
import mongoose from 'mongoose';
import morgan from 'morgan';
import {later as reqMeta} from 'req-meta-middleware';
import { writeRecord } from './inbound';
import { ParseResult } from 'req-meta-middleware/dist/types';

const DOMAINS = ['localhost'];

const mongooseConfig: mongoose.ConnectionOptions = {
  useCreateIndex: true,
  useFindAndModify: false,
  useNewUrlParser: true,
  useUnifiedTopology: true
};

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev, dir: './src' });
const handle = app.getRequestHandler();

const handleMetaParse = (meta: ParseResult) => {
  writeRecord(meta);
}

app.prepare()
.then(() => mongoose.connect(process.env.MONGO_HOST!, mongooseConfig))
.then(() => reqMeta(handleMetaParse, {internalDomains: DOMAINS}))
.then((middleware) => {
  const server = express();
  if (dev) {
    server.use(createProxyMiddleware('/api', {
      target: 'http://localhost:8080',
      pathRewrite: { '^/api': '/' },
      changeOrigin: true,
    }));
  }
  server.use(morgan('dev'));
  server.use(middleware);
  server.all('*', (req, res) => handle(req, res));
  server.listen(3000, () => {
    console.log('> Ready on http://localhost:3000');
  });
});
