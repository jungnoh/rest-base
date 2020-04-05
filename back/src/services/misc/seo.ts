import * as ConfigService from '../core/config';

interface SeoObject {
  title: string;
  metaTitle: string;
  metaKeyword: string;
  metaExp: string;
  thumbnail: string;
  favicon: string;
}

export async function set(newValue: SeoObject) {
  await ConfigService.set(
    {key: 'seo-title', value: newValue.title},
    {key: 'seo-meta-title', value: newValue.metaTitle},
    {key: 'seo-meta-kwd', value: newValue.metaKeyword},
    {key: 'seo-meta-exp', value: newValue.metaExp},
    {key: 'seo-thumbnail', value: newValue.thumbnail},
    {key: 'seo-favicon', value: newValue.favicon}
  );
}

export async function get(): Promise<SeoObject> {
  return {
    title: await ConfigService.get('seo-title') ?? '',
    metaTitle: await ConfigService.get('seo-meta-title') ?? '',
    metaKeyword: await ConfigService.get('seo-meta-kwd') ?? '',
    metaExp: await ConfigService.get('seo-meta-exp') ?? '',
    thumbnail: await ConfigService.get('seo-thumbnail') ?? '',
    favicon: await ConfigService.get('seo-favicon') ?? ''
  };
}
