import { ObjectId } from 'bson';
import AskPostModel from '../models/askPost';
import UserModel from '../models/user';
import { ServiceResult } from 'util/types';
import { AskPost } from '../../../common/models';
import { DOCS_PER_PAGE } from '../constant';

export async function create(username: string, title: string, content: string):
  ServiceResult<'USER_NEXIST', AskPost> {
  const user = await UserModel.findOne({ username });
  if (!user) {
    return {
      success: false,
      reason: 'USER_NEXIST'
    };
  }
  let newPost = await AskPostModel.create({
    author: user._id,
    content,
    title
  });
  return {
    success: true,
    result: newPost
  };
}

/**
 * @description 문의 목록을 가져옵니다.
 * @param page 조회할 페이지
 * @param author 가져올 문의 목록의 작성자
 */
export async function list(page: number, author: ObjectId):
  ServiceResult<undefined, AskPost[]> {
  const buildQuery = () => {
    let query = AskPostModel.find({ author });
    query = query.sort('-createdAt').populate('author', '_id email username');
    return query;
  };
  let query = buildQuery();
  if (page !== 1) {
    query = query.skip((page - 1) * DOCS_PER_PAGE);
  }
  return {
    success: true,
    result: await query.limit(DOCS_PER_PAGE)
  };
}

/**
 * @description 1:1 문의의 작성을 답변합니다.
 * @param id 답변 대상의 ObjectId
 * @param author 작성자의 ObjectId
 * @param content 작성 내용
 */
export async function reply(id: ObjectId, author: ObjectId, content: string):
  ServiceResult<'POST_NEXIST'> {
  const post = await AskPostModel.findById(id).populate('author');
  if (!post) {
    return {
      success: false,
      reason: 'POST_NEXIST'
    };
  }
  post.answered = true;
  post.answerContent = content;
  post.answeredAt = new Date();
  await post.save();
  return { success: true };
}

/**
 * @description 문의를 가져옵니다.
 * @param id 가려올 문의의 ObjectId
 */
export async function read(id: ObjectId):
  ServiceResult<'POST_NEXIST', AskPost> {
  const post = await AskPostModel.findById(id).populate('author', '_id email username');
  if (!post) {
    return {
      success: false,
      reason: 'POST_NEXIST'
    };
  }
  return {
    success: true,
    result: post
  };
}