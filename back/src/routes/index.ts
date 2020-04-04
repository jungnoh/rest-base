import express from 'express';
import AuthRouter from './auth';
import AskPostRouter from './askPost';
import SuperuserRouter from './superuser';

const router = express.Router();

router.use('/ask', AskPostRouter);
router.use('/auth', AuthRouter);
router.use('/super', SuperuserRouter);

export default router;
