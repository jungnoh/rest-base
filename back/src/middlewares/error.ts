import { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';
import winston from 'winston';

interface Err extends Error {
  status: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: any;
}

export function handleError(err: Err, _: Request, res: Response, __: NextFunction) {
  winston.warn(err);
  const status = err.status ?? 500;
  res.status(status).json({
    success: false
  });
}

export function rejectValFail(req: Request, res: Response, next: NextFunction) {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    next();
  } else {
    const elSeen: {[key: string]: boolean} = {};
    // Filter duplicates
    const errorReasons = errors.array().filter((item) => {
      const itemKey = `${item.location}#${item.param}`;
      return Object.prototype.hasOwnProperty.call(elSeen, itemKey) ? false: (elSeen[itemKey] = true);
    }).map(x => ({param: x.param, location: x.location}));
    res.status(400).json({
      reason: errorReasons,
      success: false
    });
  }
}
