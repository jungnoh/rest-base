import * as ConfigService from '../services/core/config';
import * as SuperuserService from '../services/core/superuser';
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

export async function setConfig(req: Request, res: Response, next: NextFunction) {
  try {
    const {key, value} = req.body;
    await ConfigService.set({key, value});
    res.json({});
  } catch (err) {
    next(err);
  }
}

export async function removeConfig(req: Request, res: Response, next: NextFunction) {
  try {
    const {key} = req.params;
    await ConfigService.remove(key);
    res.json({});
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
