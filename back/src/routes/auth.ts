import express from 'express';
import { userSignupVal, addressVal } from 'util/validators';
import { rejectValFail } from 'middlewares/error';
import * as AuthController from 'controllers/auth';
import { body } from 'express-validator';

const router = express.Router();

router.post('/signup', [
  ...userSignupVal,
  ...addressVal
], rejectValFail, AuthController.signup);

router.post('/login', [
  body('username').exists(),
  body('password').exists()
], rejectValFail, AuthController.login);

router.delete('/logout', AuthController.logout);

export default router;
