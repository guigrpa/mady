// @flow

import React from 'react';
import Relay, { graphql } from 'react-relay';
import MessageFormat from 'messageformat';
import { mainStory } from 'storyboard';
import {
  cancelEvent,
  Icon,
  Textarea,
  KEYS,
  IS_IOS,
  hoverable,
  floatAdd,
  floatDelete,
} from 'giu';
import type { Command } from 'giu/lib/gral/types';
import type { KeyT, TranslationT, HoverableProps } from '../../common/types';
import _t from '../../translate';
import createTranslation from '../mutations/createTranslation';
import updateTranslation from '../mutations/updateTranslation';
import { COLORS } from '../gral/constants';
import { mutate } from './helpers';

const validateMessageFormatSynxtax = (lang: string) => (
  val: string
): ?string => {
  const numOpen = val.split('{').length - 1;
  const numClose = val.split('}').length - 1;
  if (numOpen !== numClose) {
    return _t(
      'validation_the number of left and right brackets does not match'
    );
  }
  const mf = new MessageFormat(lang).setIntlSupport(true);
  try {
    mf.compile(val);
  } catch (err) {
    const msg = _t('validation_MessageFormat syntax error');
    return `${msg}: ${err.message}`;
  }
  return undefined;
};

// ==========================================
// Component declarations
// ==========================================
type PublicProps = {|
  lang: string,
  changeSelectedKey: (keyId: ?string) => void,
  // Relay
  relay: Object,
  theKey: KeyT,
  translation: ?TranslationT,
|};

type Props = {
  ...PublicProps,
  ...$Exact<HoverableProps>,
};

type State = {
  fEditing: boolean,
  fDismissedHelp: boolean,
  cmds: Array<Command>,
};

const gqlFragments = graphql`
  fragment eeTranslation_theKey on Key {
    id
    text
    isMarkdown
  }

  fragment eeTranslation_translation on Translation {
    id
    isDeleted
    lang
    translation
    fuzzy
  }
`;

// ==========================================
// Component
// ==========================================
class Translation extends React.Component {
  props: Props;
  state: State;
  refInput: ?Object;
  refInputWrapper: ?Object;
  helpFloatId: ?string;

  constructor(props: Props) {
    super(props);
    this.state = {
      fEditing: false,
      fDismissedHelp: false,
      cmds: [],
    };
  }

  componentWillUnmount() {
    if (this.helpFloatId != null) floatDelete(this.helpFloatId);
  }

  componentDidUpdate(prevProps: Props, prevState: State) {
    const { fEditing, fDismissedHelp } = this.state;
    if (
      fEditing !== prevState.fEditing ||
      fDismissedHelp !== prevState.fDismissedHelp
    ) {
      this.renderHelpFloat();
    }
  }

  // ------------------------------------------
  // Render
  // ------------------------------------------
  render() {
    return (
      <div
        onMouseEnter={this.props.onHoverStart}
        onMouseMove={this.props.onHoverStart}
        onMouseLeave={this.props.onHoverStop}
        style={style.outer}
      >
        {this.renderTranslation()}
        {this.renderButtons()}
      </div>
    );
  }

  renderTranslation() {
    const { lang, translation } = this.props;
    const { cmds } = this.state;
    // const fUpdating = translation && relay.hasOptimisticUpdate(translation);
    const validators = this.props.theKey.isMarkdown
      ? undefined
      : [validateMessageFormatSynxtax(lang)];
    return (
      <div
        ref={c => {
          this.refInputWrapper = c;
        }}
      >
        <Textarea
          ref={c => {
            this.refInput = c;
          }}
          value={
            translation && !translation.isDeleted
              ? translation.translation
              : null
          }
          validators={validators}
          onFocus={this.onFocus}
          onBlur={this.onBlur}
          onKeyDown={this.onKeyDown}
          onKeyUp={this.onKeyUp}
          cmds={cmds}
          style={style.textareaBase(this.state)}
        />
      </div>
    );
  }

  renderButtons() {
    const { translation } = this.props;
    const interactedWith = this.state.fEditing || this.props.hovering;
    const elFuzzy =
      translation &&
      !translation.isDeleted &&
      (interactedWith || translation.fuzzy) ? (
        <Icon
          icon="warning"
          title={_t('tooltip_Dubious translation (click to toggle)')}
          onClick={translation ? this.onClickFuzzy : undefined}
          style={style.iconFuzzy({
            button: interactedWith,
            active: translation.fuzzy,
          })}
        />
      ) : null;
    if (!interactedWith) {
      return elFuzzy ? <div style={style.buttons}>{elFuzzy}</div> : null;
    }
    const elDelete =
      translation && !translation.isDeleted ? (
        <Icon
          icon="remove"
          title={_t('tooltip_Delete translation')}
          onClick={this.onClickDelete}
          style={style.iconButton}
        />
      ) : null;
    return (
      <div style={style.buttons}>
        {elDelete}
        &nbsp;&nbsp;&nbsp;
        <Icon
          icon="copy"
          title={_t('tooltip_Copy message')}
          onMouseDown={this.onMouseDownCopy}
          style={style.iconButton}
        />
        <Icon
          icon="google"
          title={_t('tooltip_Autotranslate')}
          onClick={this.onClickAutotranslate}
          style={style.iconButton}
        />
        {elFuzzy}
      </div>
    );
  }

  renderHelp() {
    return (
      <div onMouseEnter={this.onHoverHelp} style={style.help}>
        {_t('translationHelp_Click outside or TAB to save. ESC to undo.')}
      </div>
    );
  }

  renderHelpFloat = () => {
    if (IS_IOS) return;
    const { fEditing, fDismissedHelp } = this.state;
    const fShouldShow = fEditing && !fDismissedHelp;

    // Remove float
    if (!fShouldShow && this.helpFloatId != null) {
      floatDelete(this.helpFloatId);
      this.helpFloatId = null;
      return;
    }

    // Create or update float
    if (fShouldShow && this.helpFloatId == null) {
      const floatOptions = {
        position: 'above',
        align: 'right',
        zIndex: 1,
        getAnchorNode: () => this.refInputWrapper,
        children: this.renderHelp(),
        noStyleShadow: true,
      };
      this.helpFloatId = floatAdd(floatOptions);
    }
  };

  // ------------------------------------------
  // Handlers
  // ------------------------------------------
  onFocus = () => {
    this.setState({ fEditing: true, fDismissedHelp: false });
    this.props.changeSelectedKey(this.props.theKey.id);
  };

  // RETURN + modifier key (unmodified RETURNs are accepted in the textarea): ignore (will
  // be processed on keyup)
  onKeyDown = (ev: SyntheticKeyboardEvent) => {
    if (
      ev.which === KEYS.enter &&
      (ev.ctrlKey || ev.altKey || ev.metaKey || ev.shiftKey)
    ) {
      cancelEvent(ev);
    }
  };

  // ESC: revert and blur
  // RETURN + modifier key (unmodified RETURNs are accepted in the textarea): blur (and save)
  onKeyUp = (ev: SyntheticKeyboardEvent) => {
    if (ev.which === KEYS.esc) {
      this.setState({ cmds: [{ type: 'REVERT' }, { type: 'BLUR' }] });
    } else if (
      ev.which === KEYS.enter &&
      (ev.ctrlKey || ev.altKey || ev.metaKey || ev.shiftKey)
    ) {
      this.setState({ cmds: [{ type: 'BLUR' }] });
    }
  };

  onBlur = () => {
    this.setState({ fEditing: false });
    if (!this.refInput) {
      mainStory.warn('translation', 'Could not save translation');
      return;
    }
    this.refInput.validateAndGetValue().then(text => {
      if (text === this.getInitialTranslation()) return;
      const { translation } = this.props;
      if (translation && translation.isDeleted) return;
      if (translation) {
        mutate({
          description: 'Commit translation edit',
          environment: this.props.relay.environment,
          mutationOptions: updateTranslation({
            translation,
            attrs: { translation: text },
          }),
        });
      } else {
        mutate({
          description: 'Commit translation creation',
          environment: this.props.relay.environment,
          mutationOptions: createTranslation({
            attrs: {
              lang: this.props.lang,
              keyId: this.props.theKey.id,
              translation: text,
            },
            theKey: this.props.theKey,
          }),
        });
      }
    });
  };

  onMouseDownCopy = () => {
    // $FlowFixMe: SET_VALUE not supported yet in Giu's Flow API
    this.setState({
      cmds: [
        // $FlowFixMe: SET_VALUE not supported yet in Giu's Flow API
        { type: 'SET_VALUE', value: this.props.theKey.text },
        { type: 'FOCUS' },
      ],
    });
  };

  onClickAutotranslate = async () => {
    const {
      theKey: { text },
      lang,
    } = this.props;
    const response = await fetch(
      `/mady-autotranslate?lang=${lang}&text=${encodeURIComponent(text)}`
    );
    const translation = await response.text();
    // $FlowFixMe: SET_VALUE not supported yet in Giu's Flow API
    this.setState({
      cmds: [
        // $FlowFixMe: SET_VALUE not supported yet in Giu's Flow API
        { type: 'SET_VALUE', value: translation },
        { type: 'FOCUS' },
      ],
    });
  };

  onClickDelete = () => {
    const { translation } = this.props;
    if (!translation || translation.isDeleted) return;
    mutate({
      description: 'Click on Delete translation',
      environment: this.props.relay.environment,
      mutationOptions: updateTranslation({
        translation,
        attrs: { isDeleted: true },
      }),
    });
  };

  onClickFuzzy = () => {
    const { translation } = this.props;
    if (!translation || translation.isDeleted) return;
    mutate({
      description: 'Toggle translation fuzziness',
      environment: this.props.relay.environment,
      mutationOptions: updateTranslation({
        translation,
        attrs: { fuzzy: !translation.fuzzy },
      }),
    });
  };

  onHoverHelp = () => {
    this.setState({ fDismissedHelp: true });
  };

  // ------------------------------------------
  // Helpers
  // ------------------------------------------
  getInitialTranslation(props?: Props) {
    const finalProps = props || this.props;
    return finalProps.translation ? finalProps.translation.translation : null;
  }
}

// ------------------------------------------
// Styles
// ------------------------------------------
const style = {
  outer: {
    paddingRight: 75,
    height: '100%',
    // position: 'relative',
  },
  textareaBase: ({ fEditing }) => ({
    display: 'block',
    padding: 0,
    border: '1px solid transparent',
    backgroundColor: fEditing ? undefined : 'transparent',
    minHeight: 17,
  }),
  buttons: {
    position: 'absolute',
    top: 1,
    right: 5,
    color: 'black',
  },
  iconButton: {
    marginLeft: 5,
  },
  iconFuzzy: ({ button, active }) => ({
    marginLeft: 5,
    color: button ? (active ? 'black' : COLORS.dim) : 'orange',
  }),
  help: {
    // position: 'absolute',
    // bottom: '100%',
    // right: -5,
    margin: '0 0 2px 0',
    padding: '0px 4px',
    background: COLORS.darkest,
    maxWidth: 190,
    fontSize: '0.9em',
    color: 'white',
    textAlign: 'right',
  },
};

// ==========================================
// Public API
// ==========================================
const HoverableTranslation = hoverable(Translation);
const Container = Relay.createFragmentContainer(
  HoverableTranslation,
  gqlFragments
);
export default Container;
export { HoverableTranslation as _HoverableTranslation };
