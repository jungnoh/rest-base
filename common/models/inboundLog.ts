/**
 * @description 일자별 유입로그 모델
 */
export default interface InboundLog {
  // 일자 (시간 X)
  date: Date;
  // 유입경로 (형식)
  type: string;
  // 유입 세부경로
  method: string;
  // 횟수
  count: number;
}
