import React from 'react';
import { DataTable, Icon, DropDownMenu } from 'giu';
import type { Config, Key, Keys } from '../types';
import ContextCell from './115-ContextCell';
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
  parsing: boolean;
  height: number;
  onAddLang: (lang: string) => void;
  onRemoveLang: (lang: string) => void;
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
    // const headerHeight =
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
    return (
      <DataTable
        className="mady"
        itemsById={this.props.keys}
        shownIds={this.props.shownKeyIds}
        cols={this.getCols()}
        // alwaysRenderIds={[] /* TODO: current selection: don't lose content */}
        // neverFilterIds={[] /* TODO: current selection: don't lose content */}
        headerClickForSorting={false}
        allowManualSorting={false}
        allowSelect={false}
        height={height}
      />
    );
  }

  prevColsKey!: string;
  prevCols!: any[];
  getCols() {
    const { config, keys, langs } = this.props;
    const key = langs.join(',');
    if (key === this.prevColsKey) return this.prevCols;
    const keyArr = Object.values(keys);

    // Build cols
    const cols: any = [
      {
        attr: 'context',
        render: ({ item }: { item: Key }) => <ContextCell myKey={item} />,
      },
      {
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
          <KeyCell myKey={item} config={config} langs={langs} />
        ),
      },
      ...langs.map((lang, idx) => ({
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
        rawValue: (o: Key) => o.translations[lang],
        render: ({ item }: { item: Key }) => (
          <TranslationCell myKey={item} lang={lang} />
        ),
      })),
    ];
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

    // Memoize them
    this.prevColsKey = key;
    this.prevCols = cols;
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
