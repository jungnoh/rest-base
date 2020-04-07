import { ObjectId } from 'bson';
import BoardModel from 'models/board';
import CommentModel from 'models/comment';
import PostModel from 'models/post';
import * as AuthService from 'services/auth';
import { ServiceResult } from 'util/types';
import { Post, Board, Comment } from '../../../common/models';
import { DOCS_PER_PAGE, AdminPermission } from 'constant';

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
export async function listPosts(page: number = 1, board?: string, options?: Partial<BoardSearchOptions>):
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
  query = query.sort('-createdAt');
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
 * @description 게시물의 댓글 또는 전체 댓글을 가져옵니다.
 * @param post 댓글의 해당 게시물 (undefined 시 모든 댓글)
 * @param page 페이지
 */
export async function listComments(post?: ObjectId, page = 1):
ServiceResult<null, Comment[]> {
  let query = post ? CommentModel.find({post}) : CommentModel.find({});
  if (page > 1) {
    query = query.skip(DOCS_PER_PAGE * (page - 1));
  }
  query = query.sort('-createdAt');
  return {
    result: await query.limit(DOCS_PER_PAGE),
    success: true
  };
}

/**
 * @description 게시물 내용과 댓글을 가져옵니다.
 * @param id 게시물 _id
 * @param incrementView 조회수에 1을 추가할지 여부
 */
export async function viewPost(id: ObjectId, incrementView = false):
ServiceResult<'POST_NEXIST', {post: Post, comments: Comment[]}> {
  const postObj = await (incrementView ? PostModel.findByIdAndUpdate(id, {$inc: {view: 1}}) : PostModel.findById(id));
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

/**
 * @description 새로운 게시물을 작성합니다. 작성자 정보를 이용해 작성 권한을 검증합니다.
 * @param board 게시판 키
 * @param title 게시물 제목
 * @param content 게시물 내용
 * @param author 작성자 ObjectId
 */
export async function createPost(board: string, title: string, content: string, author: ObjectId):
ServiceResult<'BOARD_NEXIST'|'USER_PERM', Post> {
  const boardObj = await BoardModel.findOne({key: board});
  if (!boardObj) {
    return {reason: 'BOARD_NEXIST', success: false};
  }
  if (boardObj.limitWriteToAdmin && !AuthService.checkAdminPerm(author, AdminPermission.Board)) {
    return {reason: 'USER_PERM', success: false};
  }
  const newPost = await PostModel.create({
    author,
    board: boardObj,
    content,
    title
  });
  return {
    result: newPost,
    success: true
  };
}

/**
 * @description 새 댓글을 작성합니다. 작성자 정보를 이용해 작성 권한을 검증합니다.
 * @param post 댓글 해당 게시물
 * @param content 댓글 내용
 * @param author 댓글 작성자
 * @param rating 평점 (필수 아님)
 */
export async function createComment(post: ObjectId, content: string, author: ObjectId, rating?: number):
ServiceResult<'POST_NEXIST'|'USER_PERM', Comment> {
  const postObj = await PostModel.findById(post).populate('board');
  if (!postObj) {
    return {reason: 'POST_NEXIST', success: false};
  }
  const canWrite = (postObj.board as Board).showComments || (await AuthService.checkAdminPerm(author, AdminPermission.Board));
  if (!canWrite) {
    return {reason: 'USER_PERM', success: false};
  }
  const newComment = await CommentModel.create({
    author,
    content,
    rating: rating ?? 0,
    post
  });
  return {result: newComment, success: true};
}

/**
 * @description 게시물을 편집합니다.
 * @param id 게시물 ObjectId
 * @param title 게시물 제목
 * @param content 게시물 내용
 */
export async function editPost(post: ObjectId, title: string, content: string):
ServiceResult<'POST_NEXIST', Post> {
  const postObj = await PostModel.findById(post);
  if (!postObj) {
    return {reason: 'POST_NEXIST', success: false};
  }
  postObj.title = title;
  postObj.content = content;
  await postObj.save();
  return {success: true};
}

/**
 * @description 게시물을 삭제합니다. 관리자 및 본인만 삭제 가능합니다.
 * @param id 삭제할 게시물의 _id
 * @param user 요청 사용자 (권한 체크에 사용), undefined일 경우 권한 체크 하지 않음.
 */
export async function removePost(id: ObjectId, user?: ObjectId):
ServiceResult<'POST_NEXIST'|'USER_NEXIST'|'USER_PERM'> {
  const postObj = await PostModel.findById(id).select('author');
  if (!postObj) {
    return {reason: 'POST_NEXIST', success: false};
  }
  if (!(user === undefined || (postObj.author as ObjectId).equals(user))) {
    const permResult = await AuthService.checkAdminPerm(user, AdminPermission.Board);
    if (!permResult.success) {
      return {success: false, reason: permResult.reason};
    } else if (!permResult.result) {
      return {success: false, reason: 'USER_PERM'};
    }
  }
  // User authenticated past this point
  await postObj.remove();
  return {success: true};
}

/**
 * @description 댓글을 삭제합니다. 관리자 및 본인만 삭제 가능합니다.
 * @param id 삭제할 댓글의 _id
 * @param user 요청 사용자 (권한 체크에 사용), undefined일 경우 권한 체크 하지 않음.
 */
export async function removeComment(id: ObjectId, user?: ObjectId):
ServiceResult<'COMMENT_NEXIST'|'USER_NEXIST'|'USER_PERM'> {
  const commentObj = await CommentModel.findById(id).select('author');
  if (!commentObj) {
    return {reason: 'COMMENT_NEXIST', success: false};
  }
  if (!(user === undefined || (commentObj.author as ObjectId).equals(user))) {
    const permResult = await AuthService.checkAdminPerm(user, AdminPermission.Board);
    if (!permResult.success) {
      return {success: false, reason: permResult.reason};
    } else if (!permResult.result) {
      return {success: false, reason: 'USER_PERM'};
    }
  }
  // User authenticated past this point
  await commentObj.remove();
  return {success: true};
}
