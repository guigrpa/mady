/* eslint-env jest */
import {
  _getRegexps as getRegexps,
  _parseWithRegexps as parseWithRegexps,
} from '../parseSources';

describe('Source parser', () => {
  describe('Function parser', () => {
    it('should work in a simple case', () => {
      const keys = {};
      const regexps = getRegexps(['FOO']);
      parseWithRegexps(
        keys,
        'FILENAME',
        `
        const a = 3;
        const str = FOO('Example');
      `,
        regexps
      );
      expect(keys).toMatchSnapshot();
    });

    it('should work with single and double quotes', () => {
      const keys = {};
      const regexps = getRegexps(['FOO']);
      parseWithRegexps(
        keys,
        'FILENAME',
        `
        const a = 3;
        const str = FOO('Example');
        const str2 = FOO("Example2");
      `,
        regexps
      );
      expect(keys).toMatchSnapshot();
    });

    it('should extract context if available', () => {
      const keys = {};
      const regexps = getRegexps(['FOO']);
      parseWithRegexps(
        keys,
        'FILENAME',
        `
        const a = 3;
        const str = FOO('context_Example');
      `,
        regexps
      );
      expect(keys).toMatchSnapshot();
    });

    it('should work with multiline strings', () => {
      const keys = {};
      const regexps = getRegexps(['FOO']);
      parseWithRegexps(
        keys,
        'FILENAME',
        `
        const a = 3;
        const str = FOO('context_This is a very
long
string');
      `,
        regexps
      );
      expect(keys).toMatchSnapshot();
    });

    it('should work with specially-named functions', () => {
      const keys = {};
      const regexps = getRegexps(['$t']);
      parseWithRegexps(
        keys,
        'FILENAME',
        `
        $t('hi') $t ('ho') $t( "there")
      `,
        regexps
      );
      expect(keys).toMatchSnapshot();
    });
  });

  describe('Custom regexp parsing', () => {
    it('should work with custom regexps', () => {
      const keys = {};
      const regexps = getRegexps([], ['{{\\s*(.*?)\\s*}}']);
      parseWithRegexps(
        keys,
        'FILENAME',
        `
        whatever
        {{ hey }}
        whatever {{ho}} {{   let's go }} and {{ !! }}
      `,
        regexps
      );
      expect(keys).toMatchSnapshot();
    });

    it('should work with custom regexps and multiline strings', () => {
      const keys = {};
      const regexps = getRegexps([], ['===([\\s\\S]*?)===']);
      parseWithRegexps(
        keys,
        'FILENAME',
        `
        ===A very
long
string===
      `,
        regexps
      );
      expect(keys).toMatchSnapshot();
    });
  });
});
