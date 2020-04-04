import express from 'express';
import * as Controller from '../controllers/superuser';
import { body } from 'express-validator';
import { rejectValFail } from '../middlewares/error';

const router = express.Router();
// router.use(checkSuperuser);

router.get('/config', Controller.getConfig);
router.get('/git', Controller.git);
router.post('/mongo',
  body('command').exists(),
  rejectValFail,
  Controller.mongo
);

export default router;
