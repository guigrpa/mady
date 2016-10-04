/* eslint-env jest */
import {
  _getRegexps as getRegexps,
  _parseFunctionCalls as parseFunctionCalls,
  _parseReactIntl as parseReactIntl,
} from '../parseSources';

describe('Source parser', () => {
  describe('Function parser', () => {
    it('should work in a simple case', () => {
      const keys = {};
      const regexpFunctionNames = getRegexps(['FOO']);
      parseFunctionCalls(keys, 'FILENAME', `
        const a = 3;
        const str = FOO('Example');
      `, regexpFunctionNames);
      expect(keys).toMatchSnapshot();
    });

    it('should work with single and double quotes', () => {
      const keys = {};
      const regexpFunctionNames = getRegexps(['FOO']);
      parseFunctionCalls(keys, 'FILENAME', `
        const a = 3;
        const str = FOO('Example');
        const str2 = FOO("Example2");
      `, regexpFunctionNames);
      expect(keys).toMatchSnapshot();
    });

    it('should extract context if available', () => {
      const keys = {};
      const regexpFunctionNames = getRegexps(['FOO']);
      parseFunctionCalls(keys, 'FILENAME', `
        const a = 3;
        const str = FOO('context_Example');
      `, regexpFunctionNames);
      expect(keys).toMatchSnapshot();
    });

    it('should work with multiline strings', () => {
      const keys = {};
      const regexpFunctionNames = getRegexps(['FOO']);
      parseFunctionCalls(keys, 'FILENAME', `
        const a = 3;
        const str = FOO('context_This is a very
long
string');
      `, regexpFunctionNames);
      expect(keys).toMatchSnapshot();
    });
  });
});
