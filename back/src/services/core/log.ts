import {LogModel, Log} from '../../models/log';

const LOGS_PER_PAGE = 50;

const NOTI_CHANNEL_MAPS: {[key: string]: string} = {'internal': '사이트', 'push': '푸쉬', 'sms': 'SMS'};

export async function addLogin(ip: string, user: string) {
  await LogModel.create({
    detail: ip,
    message: '회원이 로그인했습니다.',
    targetUser: user,
    type: 'login'
  });
}

export async function addLogout(ip: string, user: string) {
  await LogModel.create({
    detail: ip,
    message: '회원이 로그아웃했습니다.',
    targetUser: user,
    type: 'logout'
  });
}

export async function addLoginFail(ip: string, user?: string) {
  await LogModel.create({
    detail: ip,
    message: '로그인에 실패했습니다.',
    type: 'login-fail',
    targetUser: user ?? ''
  });
}

export async function addNotiFail(channel: 'internal' | 'push' | 'sms', message: string, targetUser: string) {
  await LogModel.create({
    detail: message,
    message: `${NOTI_CHANNEL_MAPS[channel]} 전송실패`,
    type: 'sms-fail',
    targetUser
  });
}

export async function addNotiSend(
  channel: 'internal' | 'push' | 'sms',
  message: string,
  success: number,
  fail: number,
  targetUser: string,
  error?: string
) {
  await LogModel.create({
    detail: message,
    message: `${NOTI_CHANNEL_MAPS[channel]} 전송: 성공 ${success}, 실패 ${fail}`,
    type: 'sms-send',
    targetUser
  });
}

export async function getPage(filter?: string[], page = 1): Promise<{count: number; items: Log[]}> {
  const buildQuery = () => {
    return LogModel.find(
      (!filter || filter.length === 0) ? {} : {type: {$in: filter}}
    ).sort('-createdAt');
  };
  const count = await buildQuery().count();
  let query = buildQuery();
  if (page > 1) {
    query = query.skip((page-1)*LOGS_PER_PAGE);
  }
  return {
    count,
    items: await query.limit(LOGS_PER_PAGE)
  };
}
