import { ObjectId } from 'bson';
import BoardModel from '../models/board';
import CommentModel from '../models/comment';
import PostModel from '../models/post';
import { ServiceResult } from 'src/util/types';
import { Post, Board, Comment } from '../../../common/models';
import { DOCS_PER_PAGE } from 'src/constants';

export interface BoardSearchOptions {
  title: string;
  content: string;
  author: ObjectId;
}

/**
 * @description 게시물 목록을 가져옵니다.
 * @param page 페이지
 * @param board 게시판 key
 * @param options 검색 옵션
 */
export async function list(page: number = 1, board?: string, options?: Partial<BoardSearchOptions>):
ServiceResult<'BOARD_NEXIST', {board?: Board, posts: Post[]}> {
  let query = PostModel.find();
  let boardObj;
  if (board) {
    boardObj = await BoardModel.findOne({key: board});
    if (!boardObj) {
      return {
        reason: 'BOARD_NEXIST',
        success: false
      };
    }
    query = query.find({board: boardObj._id});
  }
  if (options?.author) {
    query = query.find({author: options.author});
  }
  if (options?.content) {
    query = query.find({content: {$regex: options.content}});
  }
  if (options?.title) {
    query = query.find({title: options.title});
  }
  if (page > 1) {
    query = query.skip(DOCS_PER_PAGE * (page - 1));
  }
  const result = await query.limit(DOCS_PER_PAGE);
  return {
    result: {
      board: boardObj,
      posts: result
    },
    success: true
  };
}

/**
 * @description 게시물 내용과 댓글을 가져옵니다.
 * @param id 게시물 _id
 */
export async function view(id: ObjectId):
ServiceResult<'POST_NEXIST', {post: Post, comments: Comment[]}> {
  const postObj = await PostModel.findById(id);
  if (!postObj) {
    return {
      reason: 'POST_NEXIST',
      success: false
    };
  }
  const comments = await CommentModel.find({post: id});
  return {
    result: {
      comments,
      post: postObj
    },
    success: true
  };
}
