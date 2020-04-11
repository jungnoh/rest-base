import express from 'express';
import * as Controller from 'controllers/superuser';
import { body, param } from 'express-validator';
import { rejectValFail } from 'middlewares/error';

const router = express.Router();
// router.use(checkSuperuser);

router.get('/config', Controller.getConfig);
router.put('/config', [
  body('key').exists().notEmpty(),
  body('value').exists()
], rejectValFail, Controller.setConfig);
router.delete('/config/:key', [
  param('key').exists().notEmpty()
], rejectValFail, Controller.removeConfig);
router.get('/git', Controller.git);
router.post('/mongo',
  body('command').exists().isJSON(),
  rejectValFail,
  Controller.mongo
);
router.get('/imp/purchase/:id', [
  param('id').exists()
], rejectValFail, Controller.impPurchaseQuery);

export default router;
