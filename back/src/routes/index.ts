import express from 'express';
import AuthRouter from './auth';
import AskPostRouter from './askPost';
import BoardRouter from './board';
import FileRouter from './file';
import SuperuserRouter from './superuser';

const router = express.Router();

router.use('/ask', AskPostRouter);
router.use('/auth', AuthRouter);
router.use('/board', BoardRouter);
router.use('/file', FileRouter);
router.use('/super', SuperuserRouter);

export default router;
