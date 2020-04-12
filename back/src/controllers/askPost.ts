import { ObjectId } from 'bson';
import * as AskPostService from 'services/askPost';
import { NextFunction, Request, Response } from 'express';

export async function write(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await AskPostService.create(req.user!.username, req.body.title, req.body.content);
    if (!result.success) {
      res.status(400).json({ reason: result.reason });
    } else {
      res.json({ post: result.result });
    }
  } catch (err) {
    next(err);
  }
}

/**
 * @description Controller for `GET /ask/:id`
 */
export async function view(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await AskPostService.read(new ObjectId(req.params.id));
    if (!result.success) {
      res.status(400).json({ reason: result.reason });
    } else {
      const post = result.result!;
      if (!(post.author as ObjectId).equals(req.user!._id) && (req.user!.adminLevel === 0)) {
        res.status(404).json({ reason: 'FORBIDDEN' });
        return;
      }
      res.json({ post });
    }
  } catch (err) {
    next(err);
  }
}