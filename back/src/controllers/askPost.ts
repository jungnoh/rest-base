import { ObjectId } from 'bson';
import * as AskPostService from 'services/askPost';
import { NextFunction, Request, Response } from 'express';
import { AskPost } from '../../../common/models';

const itemMutator = (post: AskPost) => ({
  title: post.title,
  responded: post.answered,
  createAt: post.createdAt
});

/**
 * @description Controller for `POST /ask/write`
 */
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
 * @description Controller for `GET /ask/list`
 */
export async function list(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await AskPostService.list(parseInt(req.query.page), req.user!._id);
    res.status(200).json({ posts: result.result!.map(itemMutator) });
  } catch (err) {
    next(err);
  }
}

/**
 * @description Controller for `PUT /ask/reply/:id`
 */
export async function reply(req: Request, res: Response, next: NextFunction) {
  try {
    if (req.user!.adminLevel === 0) {
      res.status(403).json({ reason: 'FORBIDDEN' });
    } else {
      const result = await AskPostService.reply(
        new ObjectId(req.params.id),
        req.user!._id,
        req.body.content
      );
      if (!result.success) {
        res.status(400).json({ reason: result.reason });
      }
      else res.status(200).json({ success: true });
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
        res.status(403).json({ reason: 'FORBIDDEN' });
        return;
      }
      res.json({ post });
    }
  } catch (err) {
    next(err);
  }
}