import React from 'react';
import { DataTable, Icon, DropDownMenu } from 'giu';
import type { Config, Key, Keys, Translation } from '../types';
import ScopeCell from './115-ScopeCell';
import ContextCell from './116-ContextCell';
import KeyCell from './120-KeyCell';
import TranslationCell from './130-TranslationCell';

// ==============================================
// Declarations
// ==============================================
type Props = {
  config: Config;
  langs: string[];
  keys: Keys;
  shownKeyIds: string[];
  selectedKeyId: string | null;
  scopes: string[];
  parsing: boolean;
  height: number;
  onAddLang: (lang: string) => void;
  onRemoveLang: (lang: string) => void;
  onSelectKey: (keyId: string) => void;
  onDeleteKey: (id: string) => void;
  onDeleteTranslation: (keyId: string, lang: string) => void;
  onUpdateTranslation: (
    keyId: string,
    lang: string,
    updates: Partial<Translation>
  ) => void;
  onCreateTranslation: (keyId: string, lang: string, text: string) => void;
  autoTranslate: (lang: string, text: string) => Promise<string | null>;
};
type State = {
  tableBodyHeight: number | null;
};

// ==============================================
// Component
// ==============================================
class TranslationTable extends React.Component<Props, State> {
  refOuter = React.createRef<HTMLDivElement>();
  state: State = {
    tableBodyHeight: null,
  };

  componentDidMount() {
    window.addEventListener('resize', this.measure);
    this.measure();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.measure);
  }

  componentDidUpdate() {
    if (this.state.tableBodyHeight == null) this.measure();
  }

  measure = () => {
    // Only measure in case props.height is 0 (flex data table)
    if (this.props.height !== 0) return;
    const root = this.refOuter.current;
    if (!root) return;
    const totalHeight = root.offsetHeight;
    const header = root.querySelector('.giu-data-table-header');
    if (!header) return;
    const tableBodyHeight = totalHeight - (header as any).offsetHeight;
    this.setState({ tableBodyHeight });
  };

  // ==============================================
  render() {
    return (
      <div className="mady-translation-table" ref={this.refOuter}>
        {this.renderDataTable()}
      </div>
    );
  }

  renderDataTable() {
    const height = this.props.height || this.state.tableBodyHeight || 0;
    const { selectedKeyId } = this.props;
    return (
      <DataTable
        className="mady"
        itemsById={this.props.keys}
        shownIds={this.props.shownKeyIds}
        cols={this.getCols()}
        alwaysRenderIds={selectedKeyId ? [selectedKeyId] : undefined}
        headerClickForSorting={false}
        allowManualSorting={false}
        allowSelect={false}
        height={height}
        getRowClassNames={this.getRowClassNames}
      />
    );
  }

  getRowClassNames = ({ item }: { item: Key }) => {
    const out = [];
    if (item.isUnused) out.push('mady-row-unused');
    if (item.isTranslated) out.push('mady-row-translated');
    else out.push('mady-row-untranslated');
    if (item.isFuzzy) out.push('mady-row-fuzzy');
    if (item.seqStarts) out.push('mady-row-seq-starts');
    return out;
  };

  getCols() {
    const { keys, langs } = this.props;
    const keyArr = Object.values(keys);
    const cols: any = [];

    // Scope col
    if (this.props.scopes.length > 1)
      cols.push({
        attr: 'scope',
        render: ({ item }: { item: Key }) => <ScopeCell myKey={item} />,
      });

    // Context col
    cols.push({
      attr: 'context',
      render: ({ item }: { item: Key }) => <ContextCell myKey={item} />,
    });

    // Key col
    cols.push({
      attr: 'text',
      label: () => {
        const numKeys = keyArr.filter((o) => !o.unusedSince).length;
        return (
          <>
            Messages
            <span className="mady-stats" title="Messages in use">
              {numKeys}
            </span>
          </>
        );
      },
      render: ({ item }: { item: Key }) => (
        <KeyCell myKey={item} onDelete={this.props.onDeleteKey} />
      ),
    });

    // Lang cols
    langs.forEach((lang, idx) =>
      cols.push({
        attr: lang,
        label: () => {
          const numTranslations = keyArr.filter(
            (o) => !o.unusedSince && o.translations[lang]?.translation
          ).length;
          return (
            <div className="mady-lang-header">
              <span>
                {lang}
                <span className="mady-stats" title="Messages in use">
                  {numTranslations}
                </span>
                <span title="Remove column">
                  <Icon
                    className="mady-remove-column"
                    icon="times"
                    onClick={() => this.props.onRemoveLang(lang)}
                  />
                </span>
              </span>
              {idx === langs.length - 1 && (
                <AddColumn
                  config={this.props.config}
                  langs={langs}
                  onAddLang={this.props.onAddLang}
                />
              )}
            </div>
          );
        },
        rawValue: (o: Key) => o.translations[lang]?.translation,
        render: ({
          item,
          onMayHaveChangedHeight,
        }: {
          item: Key;
          onMayHaveChangedHeight: () => void;
        }) => (
          <TranslationCell
            myKey={item}
            lang={lang}
            onSelectKey={this.props.onSelectKey}
            onDelete={this.props.onDeleteTranslation}
            onUpdate={this.props.onUpdateTranslation}
            onCreate={this.props.onCreateTranslation}
            onMayHaveChangedHeight={onMayHaveChangedHeight}
            autoTranslate={this.props.autoTranslate}
          />
        ),
      })
    );

    // If no langs are available, add extra col to show
    // the add-lang button
    if (!langs.length) {
      cols.push({
        attr: '+',
        label: () => (
          <div className="mady-lang-header">
            <span />
            <AddColumn
              config={this.props.config}
              langs={langs}
              onAddLang={this.props.onAddLang}
            />
          </div>
        ),
        rawValue: () => '',
      });
    }

    return cols;
  }
}

const AddColumn = ({
  config,
  langs,
  onAddLang,
}: {
  config: Config;
  langs: string[];
  onAddLang: (lang: string) => void;
}) => {
  const items = config.langs
    .filter((lang) => langs.indexOf(lang) < 0)
    .map((lang) => ({ value: lang, label: lang }));
  if (!items.length) return null;
  return (
    <span title="Add column">
      <DropDownMenu
        className="mady-add-column"
        items={items}
        onClickItem={(_ev: any, lang: string) => onAddLang(lang)}
      >
        <Icon icon="plus" />
      </DropDownMenu>
    </span>
  );
};

// ==============================================
// Public
// ==============================================
export default TranslationTable;
