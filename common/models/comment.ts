import User from "./user";
import Post from "./post";

/**
 * @description 댓글 모델
 */
export default interface Comment {
  // pk
  id: number;
  // 작성일시
  createdAt: Date;
  // 해당 댓글
  post: Post;
  // 작성자
  author: User;
  // 댓글 내용
  content: string;
  // 평점
  rating: number;
}