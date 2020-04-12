import { ObjectId } from 'bson';
import AskPostModel from '../models/askPost';
import UserModel from '../models/user';
import { ServiceResult } from 'util/types';
import { AskPost } from '../../../common/models';

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
 * @description 문서를 가져옵니다.
 * @param id 문서의 ObjectId
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