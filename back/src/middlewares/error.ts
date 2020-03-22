import {NextFunction, Request, Response} from 'express';

interface Err extends Error {
  status: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: any;
}

export function handleError(err: Err, _: Request, res: Response, __: NextFunction) {
  console.log(err);
  const status = err.status ?? 500;
  res.status(status).json({
    success: false
  });
}
