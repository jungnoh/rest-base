import express from 'express';
import { checkAuthenticated } from 'middlewares/auth';
import { body } from 'express-validator';
import { rejectValFail } from 'middlewares/error';
import * as AskPostController from 'controllers/askPost';

const router = express.Router();

router.post('/write', checkAuthenticated, [
  body('title').exists().notEmpty(),
  body('content').exists().notEmpty()
], rejectValFail, AskPostController.write);

export default router;
