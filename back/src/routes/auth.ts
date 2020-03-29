import express from 'express';
import { userSignupVal, addressVal } from '../util/validators';
import { rejectValFail } from '../middlewares/error';
import * as AuthController from '../controllers/auth';

const router = express.Router();

router.post('/signup', [
  ...userSignupVal,
  ...addressVal
], rejectValFail, AuthController.signup);

export default router;
