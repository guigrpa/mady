import React from 'react';
import { DataTable, Icon } from 'giu';
import type { Config, Key, Keys } from '../types';

// ==============================================
// Declarations
// ==============================================
type Props = {
  sysConfig: Config;
  langs: string[];
  keys: Keys;
  shownKeyIds: string[];
  parsing: boolean;
  onClickParse: () => void;
  height: number;
};
type State = {
  tableBodyHeight: number | null;
};

// ==============================================
// Component
// ==============================================
class TranslationTable extends React.Component<Props, State> {
  refOuter = React.createRef<HTMLDivElement>();
  state = {
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
    const tableBodyHeight = totalHeight - header.offsetHeight!;
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
    const { langs } = this.props;
    const key = langs.join(',');
    if (key === this.prevColsKey) return this.prevCols;

    // Render message
    const cols: any = [
      {
        attr: 'text',
        label: (
          <div className="mady-col-header-messages">
            Messages&nbsp;&nbsp;
            <Icon
              className="mady-parse"
              icon="sync"
              onClick={this.props.onClickParse}
            >
              Parse
            </Icon>
          </div>
        ),
        render: ({ item }: { item: Key }) => (
          <div>
            <b>{item.context}</b> {item.text}
          </div>
        ),
      },
    ];

    // Render translations
    langs.forEach((lang) => {
      cols.push({
        attr: lang,
        label: lang,
        rawValue: (o: Key) => o.translations[lang],
        render: ({ item }: { item: Key }) =>
          item.translations[lang]?.translation,
      });
    });

    // Memoize them
    this.prevColsKey = key;
    this.prevCols = cols;
    return cols;
  }
}

// ==============================================
// Public
// ==============================================
export default TranslationTable;
