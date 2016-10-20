// @flow

/* eslint-disable global-require, import/no-dynamic-require */
import type {
  MapOf,
  LocaleFunctionT,
} from '../../common/types';

const fetchLangBundle = (
  lang: string,
  cb: (locales: MapOf<LocaleFunctionT>) => void,
) =>
  // $FlowFixMe Flow hates dynamic requires
  require(`bundle!../../locales/${lang}.js`)(cb);

export default fetchLangBundle;
