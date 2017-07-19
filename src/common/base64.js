// @flow

// $FlowFixMe
import { Buffer } from 'buffer';

const utf8ToBase64 = (str: string): string =>
  Buffer.from(str, 'utf8').toString('base64');
const base64ToUtf8 = (str: string): string =>
  Buffer.from(str, 'base64').toString('utf8');

export { utf8ToBase64, base64ToUtf8 };
