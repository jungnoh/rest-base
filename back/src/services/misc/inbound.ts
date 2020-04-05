import moment from 'moment';
import CampaignLogModel from '../../models/campaignLog';
import { DOCS_PER_PAGE } from '../../constants';

/**
 * @description 유입 접속 로그를 가져옵니다.
 * @param page 가져올 페이지
 * @param startDate 일자 범위 시작일
 * @param endDate 일자 범위 종료일
 */
export async function campaignLog(page = 1, startDate: moment.Moment, endDate: moment.Moment) {
  let query = CampaignLogModel.find({
    time: {$gte: startDate.toDate(), $lte: endDate.toDate()}
  }).sort('-time');
  if (page > 1) {
    query = query.skip((page - 1)*DOCS_PER_PAGE);
  }
  return await query.limit(DOCS_PER_PAGE);
}