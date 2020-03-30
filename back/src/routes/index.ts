import express from 'express';
import AuthRouter from './auth';
import AskPostRouter from './askPost';

const router = express.Router();

router.use('/ask', AskPostRouter);
router.use('/auth', AuthRouter);

export default router;
