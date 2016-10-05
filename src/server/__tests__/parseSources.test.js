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

  describe('React Intl parser', () => {
    it('should extract messages from FormattedMessage components', () => {
      const keys = {};
      parseReactIntl(keys, 'FILENAME', `
        import { FormattedMessage } from 'react-intl';
        const name = 'Guille';
        const Component = () => (
          <FormattedMessage
            id="reactIntlId1"
            defaultMessage={\`context_Hello {NAME}!\`}
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
            defaultMessage={\`context_<i>Hello {NAME}!</i>\`}
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
            defaultMessage: 'someContext_Hello, {NAME}!',
          },
        });
      `);
      expect(keys).toMatchSnapshot();
    });
  });
});
