import express from 'express';
import { param } from 'express-validator';
import { rejectValFail } from 'middlewares/error';
import * as Controller from 'controllers/file';
import { checkAuthenticated } from 'middlewares/auth';

const router = express.Router();

router.get('/get/:id', [
  param('id').exists().isMongoId()
], rejectValFail, Controller.get);

router.post('/upload', checkAuthenticated, Controller.uploadFile);

export default router;
