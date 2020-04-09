import * as BoardService from 'services/board';
import { Request, Response, NextFunction } from 'express';
import { User } from '../../../common/models';
import { ObjectId } from 'bson';

/**
 * @description Controller for `POST /board/post`
 */
export async function writePost(req: Request, res: Response, next: NextFunction) {
  try {
    const {board, content, title} = req.body;
    const ret = await BoardService.createPost(board, title, content, req.user!._id);
    if (ret.success) {
      res.status(200).json({});
      return;
    }
    if (ret.reason === 'USER_PERM') {
      res.status(403).json({reason: ret.reason});
    } else if (ret.reason === 'BOARD_NEXIST') {
      res.status(400).json({reason: ret.reason});
    }
  } catch (err) {
    next(err);
  }
}

/**
 * @description Controller for `GET /board/list/:board/:page
 */
export async function list(req: Request, res: Response, next: NextFunction) {
  try {
    const {board, page} = req.query;
    const ret = await BoardService.listPosts(page, board);
    if (ret.success) {
      return res.status(200).json({
        posts: ret.result!.posts.map(x => ({
          createdAt: x.createdAt,
          title: x.title,
          user: (x.author as User).username,
          view: x.view
        }))
      });
    }
    res.status(400).json({
      reason: ret.reason
    });
  } catch (err) {
    next(err);
  }
}

/**
 * @description Controller for `GET /board/post/:id`
 */
export async function viewPost(req: Request, res: Response, next: NextFunction) {
  try {
    const {id} = req.params;
    const ck = (((req.cookies ?? {})['board_'] as string) ?? '').split('/');
    const hasHistory = ck.includes(req.params.id);
    
    const ret = await BoardService.viewPost(new ObjectId(id), hasHistory);

    if (!ret.success) {
      return res.status(404).json({
        reason: ret.reason
      });
    }
    if (!hasHistory) {
      res.cookie('board_notice', [...ck, req.params.id].filter(v => v !== '').join('/'));
    }
    res.json({
      post: ret.result?.post,
      comments: ret.result?.comments
    });
  } catch (err) {
    next(err);
  }
}

/**
 * @description Controller for `PUT /board/post/:id`
 */
export async function updatePost(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const { content, title } = req.body;
    const result = await BoardService.editPost(new ObjectId(id), title, content, req.user!._id);
    if (result.success) {
      return res.json({});
    }
    if (result.reason === 'POST_NEXIST') {
      return res.status(404).json({reason: result.reason});
    }
    if (result.reason === 'USER_PERM') {
      return res.status(403).json({reason: result.reason});
    }
  } catch (err) {
    next(err);
  }
}

/**
 * @description Controller for `DELETE /board/post/:id`
 */
export async function removePost(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const ret = await BoardService.removePost(new ObjectId(id), req.user!._id);
    if (ret.success) {
      return res.json({});
    }
    if (ret.reason === 'POST_NEXIST') {
      return res.status(404).json({reason: ret.reason});
    }
    if (ret.reason === 'USER_NEXIST') {
      return res.status(401).json({reason: ret.reason});
    }
    if (ret.reason === 'USER_PERM') {
      return res.status(403).json({reason: ret.reason});
    }
  } catch (err) {
    next(err);
  }
}

/**
 * @description Controller for `POST /board/comment`
 */
export async function writeComment(req: Request, res: Response, next: NextFunction) {
  try {
    const { post, content, rating } = req.body;
    const result = await BoardService.createComment(new ObjectId(post), content, req.user?._id, rating);
    if (result.success) {
      return res.json({
        comment: result.result
      });
    }
    if (result.reason === 'POST_NEXIST') {
      return res.status(404).json({reason: result.reason});
    }
    return res.status(403).json({reason: result.reason});
  } catch (err) {
    next(err);
  }
}

/**
 * @description Controller for `DELETE /board/comment/:id`
 */
export async function removeComment(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const result = await BoardService.removeComment(new ObjectId(id), req.user?._id);
    if (result.success) {
      return res.json({});
    }
    if (result.reason === 'USER_NEXIST') {
      return res.status(401).json({reason: result.reason});
    }
    if (result.reason === 'COMMENT_NEXIST') {
      return res.status(404).json({reason: result.reason});
    }
    if (result.reason === 'USER_PERM') {
      return res.status(403).json({reason: result.reason});
    }
  } catch (err) {
    next(err);
  }
}