import { ObjectId } from "bson";
import Board from "./board";
import User from "./user";

/**
 * @description 게시물 모델
 */
export default interface Post {
  // 게시판
  board: Board;
  // 제목
  title: string;
  // 내용
  content: string;
  // 작성자
  author: User | ObjectId;
  // 생성시간
  createdAt: Date;
}
