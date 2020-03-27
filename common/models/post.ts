import User from "./user";
import Board from "./board";
import Comment from "./comment";

/**
 * @description 게시물 모델
 */
export default interface Post {
  // pk
  id: number;
  // 게시판
  board: Board;
  // 제목
  title: string;
  // 내용
  content: string;
  // 작성자
  author: User;
  // 생성시간
  createdAt: Date;
  // 댓글
  comments: Comment[];
}
