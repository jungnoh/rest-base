import express from 'express';
import { checkAuthenticated } from 'middlewares/auth';
import { body, param } from 'express-validator';
import { rejectValFail } from 'middlewares/error';
import * as AskPostController from 'controllers/askPost';

const router = express.Router();

router.post('/write', checkAuthenticated, [
  body('title').exists().notEmpty(),
  body('content').exists().notEmpty()
], rejectValFail, AskPostController.write);

router.put('/reply/:id', checkAuthenticated, [
  param('id').isMongoId().bail(),
  body('content').exists().notEmpty()
], rejectValFail, AskPostController.reply);

router.get('/ask/:id', checkAuthenticated, [
  param('id').isMongoId()
], rejectValFail, AskPostController.view);

export default router;
