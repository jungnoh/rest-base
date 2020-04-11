import * as ConfigService from '../core/config';

const CONFIG_KEYS = {
  Title: 'SEO_TITLE',
  Keyword: 'SEO_KEYWORD',
  MetaTitle: 'SEO_META_TITLE',
  MetaExp: 'SEO_META_EXP',
  Thumbnail: 'SEO_META_THUMB',
  Favicon: 'SEO_FAVICON'
};

interface SeoObject {
  title: string;
  metaTitle: string;
  metaKeyword: string;
  metaExp: string;
  thumbnail: string;
  favicon: string;
}

export async function init(): Promise<string[]> {
  return Object.values(CONFIG_KEYS);
}

export async function set(newValue: SeoObject) {
  await ConfigService.set(
    {key: CONFIG_KEYS.Title, value: newValue.title},
    {key: CONFIG_KEYS.MetaTitle, value: newValue.metaTitle},
    {key: CONFIG_KEYS.Keyword, value: newValue.metaKeyword},
    {key: CONFIG_KEYS.MetaExp, value: newValue.metaExp},
    {key: CONFIG_KEYS.Thumbnail, value: newValue.thumbnail},
    {key: CONFIG_KEYS.Favicon, value: newValue.favicon}
  );
}

export async function get(): Promise<SeoObject> {
  return {
    title: await ConfigService.get(CONFIG_KEYS.Title) ?? '',
    metaTitle: await ConfigService.get(CONFIG_KEYS.MetaTitle) ?? '',
    metaKeyword: await ConfigService.get(CONFIG_KEYS.Keyword) ?? '',
    metaExp: await ConfigService.get(CONFIG_KEYS.MetaExp) ?? '',
    thumbnail: await ConfigService.get(CONFIG_KEYS.Thumbnail) ?? '',
    favicon: await ConfigService.get(CONFIG_KEYS.Favicon) ?? ''
  };
}
