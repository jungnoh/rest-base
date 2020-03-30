import { User } from ".";

/**
 * @description 1:1 문의 게시물 모델
 */
export default interface AskPost {
  // 작성자
  author: User;
  // 생성일시
  createdAt: Date;
  // 답변일시
  answeredAt?: Date;
  // 제목
  title: string;
  // 질문내용
  content: string;
  // 답변내용
  answerContent: string;
  // 답변여부
  answered: boolean;
}