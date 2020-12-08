import { STORAGE_NAMESPACE } from './constants';
/* eslint-env browser */

const localGet = (
  key: string,
  { defaultValue }: { defaultValue?: any } = {}
) => {
  let out = defaultValue;
  try {
    const str = localStorage[`${STORAGE_NAMESPACE}.${key}`];
    out = JSON.parse(str);
  } catch (err) {
    /* ignore */
  }
  return out;
};

const localSet = (key: string, value: any) => {
  try {
    localStorage[`${STORAGE_NAMESPACE}.${key}`] = JSON.stringify(value);
  } catch (err) {
    /* ignore */
  }
};

const localDelete = (key: string) => {
  localStorage.removeItem(`${STORAGE_NAMESPACE}.${key}`);
};

export { localGet, localSet, localDelete };
