const utf8ToBase64 = (str) => new Buffer(str, 'utf8').toString('base64');
const base64ToUtf8 = (str) => new Buffer(str, 'base64').toString('utf8');

export { utf8ToBase64, base64ToUtf8 };
