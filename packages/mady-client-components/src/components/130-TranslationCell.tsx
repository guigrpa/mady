import React from 'react';
import classnames from 'classnames';
import { Icon, Textarea, KEYS, cancelEvent } from 'giu';
import MessageFormat from 'messageformat';
import type { Key, Translation } from '../types';

// ==============================================
// Declarations
// ==============================================
type Props = {
  myKey: Key;
  lang: string;
  onSelectKey: (keyId: string) => void;
  onDelete: (keyId: string, lang: string) => void;
  onUpdate: (
    keyId: string,
    lang: string,
    updates: Partial<Translation>
  ) => void;
  onCreate: (keyId: string, lang: string, text: string) => void;
  onMayHaveChangedHeight: Function;
};
type State = {
  editing: boolean;
  dismissedHelp: boolean;
};

// ==============================================
// Component
// ==============================================
class TranslationCell extends React.Component<Props, State> {
  state: State = {
    editing: false,
    dismissedHelp: false,
  };
  translation: Translation | undefined;
  refTextarea = React.createRef<any>();

  // ==============================================
  render() {
    const { myKey, lang } = this.props;
    this.translation = myKey.translations[lang];
    return (
      <div
        className={classnames('mady-translation-cell', {
          'mady-seq-starts': myKey.seqStarts,
          'mady-is-first-key': myKey.isFirstKey,
          unused: myKey.unusedSince != null,
        })}
      >
        {this.renderTranslation()}
        {this.renderButtons()}
      </div>
    );
  }

  renderTranslation() {
    const validators = this.props.myKey.isMarkdown
      ? undefined
      : [validateMessageFormatSynxtax(this.props.lang)];
    return (
      <div className="mady-translation-text">
        {this.renderHelp()}
        <Textarea
          className="mady-translation"
          ref={this.refTextarea}
          value={this.translation?.translation || null}
          validators={validators}
          onChange={this.props.onMayHaveChangedHeight}
          onFocus={this.onFocus}
          onBlur={this.onBlur}
          onKeyDown={this.onKeyDown}
          onKeyUp={this.onKeyUp}
        />
      </div>
    );
  }

  renderHelp() {
    const shown = this.state.editing && !this.state.dismissedHelp;
    return (
      <div
        className={classnames('mady-translation-help', { shown })}
        onMouseEnter={() => this.setState({ dismissedHelp: true })}
      >
        Click outside or TAB to save. ESC to undo.
      </div>
    );
  }

  renderButtons() {
    const { myKey, lang, onDelete } = this.props;
    const hasTranslation = !!this.translation;
    const fuzzy = this.translation?.fuzzy;
    return (
      <div className="mady-translation-buttons">
        {hasTranslation && (
          <span
            className="mady-translation-button on-hover mady-delete-translation"
            title="Delete translation"
          >
            <Icon icon="times" onClick={() => onDelete(myKey.id, lang)} />
          </span>
        )}
        {hasTranslation && (
          <span
            className={classnames(
              'mady-translation-button on-hover mady-fuzzy',
              { fuzzy }
            )}
            title="Dubious translation (click to toggle)"
          >
            <Icon
              icon="exclamation-triangle"
              onClick={() => this.onClickFuzzy(!fuzzy)}
            />
          </span>
        )}
      </div>
    );
  }

  // ==============================================
  onFocus = () => {
    this.setState({ editing: true, dismissedHelp: false });
    this.props.onSelectKey(this.props.myKey.id);
  };

  onBlur = async () => {
    const { myKey, lang } = this.props;
    this.setState({ editing: false });
    const text = await this.refTextarea.current!.validateAndGetValue();
    if ((this.translation?.translation || null) === text) return;
    if (this.translation && !text) {
      this.props.onDelete(myKey.id, lang);
    } else if (this.translation) {
      this.props.onUpdate(myKey.id, lang, { translation: text });
    } else {
      this.props.onCreate(myKey.id, lang, text);
    }
  };

  onKeyDown = (ev: KeyboardEvent) => {
    // RETURN + modifier key (unmodified RETURNs are accepted in the textarea): ignore (will
    // be processed on keyup)
    if (
      ev.which === KEYS.enter &&
      (ev.ctrlKey || ev.altKey || ev.metaKey || ev.shiftKey)
    ) {
      cancelEvent(ev);
    }
  };

  onKeyUp = (ev: KeyboardEvent) => {
    // ESC: revert and blur
    if (ev.which === KEYS.esc) {
      this.refTextarea.current!.revert();
      this.refTextarea.current!.blur();
      // RETURN + modifier key (unmodified RETURNs are accepted in the textarea): blur (and save)
    } else if (
      ev.which === KEYS.enter &&
      (ev.ctrlKey || ev.altKey || ev.metaKey || ev.shiftKey)
    ) {
      this.refTextarea.current!.blur();
    }
  };

  onClickFuzzy = (fuzzy: boolean) => {
    const { myKey, lang } = this.props;
    this.props.onUpdate(myKey.id, lang, { fuzzy });
  };
}

// ==============================================
const validateMessageFormatSynxtax = (lang: string) => (val: string) => {
  // Check open-close brackets
  const numOpen = val.split('{').length - 1;
  const numClose = val.split('}').length - 1;
  if (numOpen !== numClose) {
    return 'the number of left and right brackets does not match';
  }

  // Check MessageFormat syntax
  const mf = new MessageFormat(lang);
  try {
    mf.compile(val);
  } catch (err) {
    return `MessageFormat syntax error: ${err.message}`;
  }
  return undefined;
};

// ==============================================
// Public
// ==============================================
export default TranslationCell;
