/* eslint-env jest */
import {
  _getRegexps as getRegexps,
  _parseWithRegexps as parseWithRegexps,
  _parseReactIntl as parseReactIntl,
} from '../parseSources';

describe('Source parser', () => {
  describe('Function parser', () => {
    it('should work in a simple case', () => {
      const keys = {};
      const regexps = getRegexps(['FOO']);
      parseWithRegexps(keys, 'FILENAME', `
        const a = 3;
        const str = FOO('Example');
      `, regexps);
      expect(keys).toMatchSnapshot();
    });

    it('should work with single and double quotes', () => {
      const keys = {};
      const regexps = getRegexps(['FOO']);
      parseWithRegexps(keys, 'FILENAME', `
        const a = 3;
        const str = FOO('Example');
        const str2 = FOO("Example2");
      `, regexps);
      expect(keys).toMatchSnapshot();
    });

    it('should extract context if available', () => {
      const keys = {};
      const regexps = getRegexps(['FOO']);
      parseWithRegexps(keys, 'FILENAME', `
        const a = 3;
        const str = FOO('context_Example');
      `, regexps);
      expect(keys).toMatchSnapshot();
    });

    it('should work with multiline strings', () => {
      const keys = {};
      const regexps = getRegexps(['FOO']);
      parseWithRegexps(keys, 'FILENAME', `
        const a = 3;
        const str = FOO('context_This is a very
long
string');
      `, regexps);
      expect(keys).toMatchSnapshot();
    });

    it('should work with specially-named functions', () => {
      const keys = {};
      const regexps = getRegexps(['$t']);
      parseWithRegexps(keys, 'FILENAME', `
        $t('hi') $t ('ho') $t( "there")
      `, regexps);
      expect(keys).toMatchSnapshot();
    });
  });

  describe('Custom regexp parsing', () => {
    it('should work with custom regexps', () => {
      const keys = {};
      const regexps = getRegexps([], ['{{\\s*(.*?)\\s*}}']);
      parseWithRegexps(keys, 'FILENAME', `
        whatever
        {{ hey }}
        whatever {{ho}} {{   let's go }} and {{ !! }}
      `, regexps);
      expect(keys).toMatchSnapshot();
    });

    it('should work with custom regexps and multiline strings', () => {
      const keys = {};
      const regexps = getRegexps([], ['===([\\s\\S]*?)===']);
      parseWithRegexps(keys, 'FILENAME', `
        ===A very
long
string===
      `, regexps);
      expect(keys).toMatchSnapshot();
    });
  });

  describe('React Intl parser', () => {
    it('should extract messages from FormattedMessage components', () => {
      const keys = {};
      parseReactIntl(keys, 'FILENAME', `
        import { FormattedMessage } from 'react-intl';
        const name = 'Guille';
        const Component = () => (
          <FormattedMessage
            id="reactIntlId1"
            defaultMessage={\`Hello {NAME}!\`}
            values={{ NAME: <b>{name}</b> }}
            description="Bla bla bla"
          />
        );
      `);
      expect(keys).toMatchSnapshot();
    });

    it('should extract messages from FormattedHTMLMessage components', () => {
      const keys = {};
      parseReactIntl(keys, 'FILENAME', `
        import { FormattedHTMLMessage } from 'react-intl';
        const name = 'Guille';
        const Component = () => (
          <FormattedHTMLMessage
            id="reactIntlId2"
            defaultMessage={\`<i>Hello {NAME}!</i>\`}
            values={{ NAME: name }}
          />
        );
      `);
      expect(keys).toMatchSnapshot();
    });

    it('should extract messages from defineMessages() calls', () => {
      const keys = {};
      parseReactIntl(keys, 'FILENAME', `
        import { defineMessages } from 'react-intl';
        defineMessages({
          reactIntlId3: {
            id: 'reactIntlId3',
            description: 'Message to greet the user',
            defaultMessage: 'Hello, {NAME}!',
          },
        });
      `);
      expect(keys).toMatchSnapshot();
    });
  });
});
