import express from 'express';
import * as Controller from 'controllers/board';
import { body, param, check } from 'express-validator';
import { rejectValFail } from 'middlewares/error';
import { checkAuthenticated } from 'middlewares/auth';

const router = express.Router();

router.get('/list/:board/:page', [
  param('board').exists(),
  param('page').exists().isInt().toInt()
], rejectValFail, Controller.list);

router.get('/post/:id', [
  param('id').exists().isMongoId()
], rejectValFail, Controller.viewPost);

router.put('/post/:id', checkAuthenticated, [
  param('id').exists().isMongoId(),
  body('content').exists().notEmpty(),
  body('title').exists().notEmpty()
], rejectValFail, Controller.updatePost);

router.post('/post', checkAuthenticated, [
  body('board').exists().notEmpty(),
  body('content').exists().notEmpty(),
  body('title').exists().notEmpty(),
], rejectValFail, Controller.writePost);

router.delete('/post/:id', checkAuthenticated, [
  param('id').exists().isMongoId()
], rejectValFail, Controller.removePost);

router.post('/comment', checkAuthenticated, [
  body('post').exists().isMongoId(),
  body('content').exists().notEmpty(),
  body('rating').isInt({min: 1, max: 5}).toInt()
], rejectValFail, Controller.writeComment);

router.delete('/comment/:id', checkAuthenticated, [
  param('id').exists().isMongoId()
], rejectValFail, Controller.removeComment);

export default router;
