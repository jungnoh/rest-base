import * as SuperuserService from '../services/superuser';
import { Request, Response, NextFunction } from 'express';

export async function git(_: Request, res: Response, next: NextFunction) {
  try {
    res.json(await SuperuserService.gitInfo());
  } catch (err) {
    next(err);
  }
}

export async function getConfig(_: Request, res: Response, next: NextFunction) {
  try {
    res.json(await SuperuserService.allConfig());
  } catch (err) {
    next(err);
  }
}

export async function mongo(req: Request, res: Response, next: NextFunction) {
  try {
    res.json(await SuperuserService.mongo(req.body.command));
  } catch (err) {
    next(err);
  }
}
