import { Request, Response, NextFunction } from 'express';
import * as AuthService from '../services/auth';
import passport from 'passport';
import winston from 'winston';

export async function signup(req: Request, res: Response, next: NextFunction) {
  try {
    if (req.isAuthenticated()) {
      res.status(403).json({});
      return;
    }
    const result = await AuthService.create(req.body);
    if (result.success) {
      res.json({});
    } else {
      res.status(400).json({reason: result.reason});
    }
  } catch (err) {
    next(err);
  }
}

export const login = [
  (req: Request, res: Response, next: NextFunction) => {
    if (req.isAuthenticated()) {
      res.status(403).json({reason: 'AUTENTICATED'});
    } else {
      next();
    }
  },
  passport.authenticate('local', {failWithError: true}),
  (req: Request, res: Response) => {
    res.json({});
  },
  (err: any, req: Request, res: Response, __: NextFunction) => {
    /**
     * @see AuthService.authenticate reason values
     */
    if (err === 'BAD_CREDENTIALS') {
      res.status(401).json({reason: err});
    } else if (err === 'INACTIVE') {
      res.status(403).json({reason: err});
    } else {
      winston.warn(`Uncaught error during authentication: ${err}`);
      res.status(500).json({});
    }
  }
];

export function logout(req: Request, res: Response) {
  req.logout();
  res.json({});
}
