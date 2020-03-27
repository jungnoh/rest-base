/**
 * @description 캠페인 (검색, UTM 등) 로그 기록 모델
 */
export default interface CampaignLog {
  // pk
  id: number;
  // 유입경로 (형식)
  type: string;
  // 유입 세부경로
  method: string;
  // 유입 검색어 (존재할 경우)
  searchTerm?: string;
  // 유입 IP
  ip: string;
  // IP 국가
  country?: string;
  // IP 지역
  region?: string;
}