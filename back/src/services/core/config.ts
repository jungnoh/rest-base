import { Config, ConfigModel } from '../../models/config';

const cache: {[key: string]: string} = {};

/**
 * @description 주어진 키로 설정 값을 가져옵니다. 없으면 `null`을 반환합니다.
 * @param key 키 값
 */
export async function get(key: string): Promise<string | null> {
  key = key.toUpperCase();
  if (!cache[key]) {
    const entry = (await ConfigModel.findOne({key}));
    if (!entry) return null;
    cache[key] = entry.value;
  }
  return cache[key];
}

/**
 * @description 모든 설정값을 가져옵니다. 이 경우는 캐시를 사용하지 않습니다.
 */
export async function getAll(): Promise<Config[]> {
  const ret = await ConfigModel.find({});
  for (const item of ret) {
    cache[item.key] = item.value;
  }
  return ret;
}

/**
 * @description 주어진 키로 값을 저장합니다.
 * @param key 키 값
 * @param value 저장할 걊
 */
export async function set(...items: {key: string; value: string}[]) {
  for (const item of items) {
    let {key, value} = item;
    key = key.toUpperCase();
    cache[key] = value;
    await ConfigModel.findOneAndUpdate({key}, {key, value}, {upsert: true});
  }
}

export async function remove(key: string) {
  key = key.toUpperCase();
  if (Object.prototype.hasOwnProperty.call(cache, key)) {
    delete cache[key];
  }
  await ConfigModel.findOneAndDelete({key});
}
