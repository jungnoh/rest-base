import User from "./user";
import Post from "./post";
import { ObjectId } from "bson";

/**
 * @description 댓글 모델
 */
export default interface Comment {
  // 작성일시
  createdAt: Date;
  // 작성자
  author: ObjectId | User;
  // 댓글 내용
  content: string;
  // 평점
  rating: number;
  // 대상 게시물
  post: ObjectId | Post;
}