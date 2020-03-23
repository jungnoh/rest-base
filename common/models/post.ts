import User from "./user";

export default interface Post {
  // pk
  id: number;
  // 게시판 키
  board: string;
  // 제목
  title: string;
  // 내용
  content: string;
  // 작성자
  author: User;
  // 생성시간
  createdAt: Date;
}
