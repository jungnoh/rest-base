import * as AskPostService from 'services/askPost';
import { NextFunction, Request, Response } from 'express';

export async function write(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await AskPostService.create(req.user!.username, req.body.title, req.body.content);
    if (!result.success) {
      res.status(400).json({reason: result.reason});
    } else {
      res.json({post: result.result});
    }
  } catch (err) {
    next(err);
  }
}
