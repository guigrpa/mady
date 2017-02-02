// Flow is disabled, since it doesn't support import() yet.
// Track: https://github.com/facebook/flow/issues/2968

/* eslint-disable global-require, import/no-dynamic-require */
import type {
  MapOf,
  LocaleFunctionT,
} from '../../common/types';

const fetchLangBundle = (
  lang: string,
  cb: (locales: MapOf<LocaleFunctionT>) => void,
) => {
  import(`../../locales/${lang}.js`).then(cb);
};

export default fetchLangBundle;
