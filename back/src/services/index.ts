import * as NotiService from './core/notifications';
import * as FileService from './core/file';
import * as PayService from './core/iamport';
import * as SeoService from './misc/seo';
import * as ConfigService from './core/config';
import winston from 'winston';

export async function init() {
  const keysRequired: {svc: string; key: string}[] = [];
  let undefKeys = 0;

  const pushKeys = (svc: string, keys: string[]) => {
    keysRequired.push(...(keys.map(x => ({key: x, svc}))));
  };
  
  pushKeys('noti', await NotiService.init());
  pushKeys('file', await FileService.init());
  pushKeys('seo', await SeoService.init());
  pushKeys('imp', await PayService.init());

  keysRequired.sort((a,b) => (a.key < b.key ? -1 : 1));
  winston.info(`init: Finished loading services, checking ${keysRequired.length} keys..`);
  for (const key of keysRequired) {
    if (!(await ConfigService.get(key.key))) {
      winston.warn(`init: Config ${key.key} undefined! (${key.svc})`);
      undefKeys++;
    }
  }
  winston.info(`init: Key check complete with ${undefKeys} undefined keys.`);
}