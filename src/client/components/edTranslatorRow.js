// @flow

/* eslint-disable react/no-multi-comp */

import timm from 'timm';
import React from 'react';
import Relay, { graphql } from 'react-relay';
import { cancelEvent, flexContainer, flexItem, Icon, hoverable } from 'giu';
import type { KeyT, HoverableProps } from '../../common/types';
import _t from '../../translate';
import updateKey from '../mutations/updateKey';
import { COLORS } from '../gral/constants';
import { mutate } from './helpers';
import Translation from './eeTranslation';

// ==========================================
// Component declarations
// ==========================================
type PublicProps = {|
  langs: Array<string>,
  fSelected: boolean,
  changeSelectedKey: (keyId: ?string) => void,
  styleKeyCol: Object,
  styleLangCol: Object,
  // Relay
  relay: Object,
  theKey: KeyT,
|};

type Props = {
  ...PublicProps,
  ...$Exact<HoverableProps>,
};

const gqlFragments = graphql`
  fragment edTranslatorRow_theKey on Key {
    id
    context
    text
    unusedSince
    ...eeTranslation_theKey
    translations(first: 100000)
      @connection(key: "TranslatorRow_theKey_translations") {
      edges {
        node {
          id
          isDeleted
          lang
          ...eeTranslation_translation
        }
      }
    }
  }
`;

// ==========================================
// Component
// ==========================================
class TranslatorRow extends React.PureComponent {
  props: Props;

  // ------------------------------------------
  // Render
  // ------------------------------------------
  render() {
    const { theKey: key } = this.props;
    const fUnused = !!key.unusedSince;
    const elContext = key.context ? (
      <span style={style.context}>{key.context}</span>
    ) : (
      undefined
    );
    const elText = <span style={style.text}>{key.text}</span>;
    const elDeleteKey = this.props.hovering ? (
      <Icon
        icon="remove"
        title={_t('tooltip_Delete message (does NOT delete any translations)')}
        onClick={this.onClickDeleteKey}
        style={style.removeIcon}
      />
    ) : (
      undefined
    );
    let cellStyle = timm.merge(
      style.bodyCell,
      this.props.styleKeyCol,
      style.keyCell
    );
    const { fSelected } = this.props;
    if (fSelected) cellStyle = style.selected(cellStyle);
    if (fUnused) cellStyle = style.unused(cellStyle);
    return (
      <div
        className="tableBodyRow"
        id={key.id}
        onClick={this.onClickKeyRow}
        style={style.row(fSelected)}
      >
        <div
          onMouseEnter={this.props.onHoverStart}
          onMouseMove={this.props.onHoverStart}
          onMouseLeave={this.props.onHoverStop}
          style={cellStyle}
        >
          {elContext}
          {elText}
          {elDeleteKey}
        </div>
        {this.props.langs.map(this.renderTranslation)}
      </div>
    );
  }

  renderTranslation = (lang: string) => {
    const { theKey: key } = this.props;
    const edge = key.translations.edges.find(
      ({ node }) => node.lang === lang && !node.isDeleted
    );
    const translation = edge ? edge.node : null;
    const fUnused = !!key.unusedSince;
    let cellStyle = timm.merge(style.bodyCell, this.props.styleLangCol);
    if (!edge && !fUnused) cellStyle = style.untranslated(cellStyle);
    if (this.props.fSelected) cellStyle = style.selected(cellStyle);
    return (
      <div key={lang} style={cellStyle}>
        <Translation
          theKey={key}
          lang={lang}
          translation={translation}
          changeSelectedKey={this.props.changeSelectedKey}
        />
      </div>
    );
  };

  // ------------------------------------------
  // Handlers
  // ------------------------------------------
  onClickKeyRow = () => {
    this.props.changeSelectedKey(this.props.theKey.id);
  };

  onClickDeleteKey = (ev: SyntheticKeyboardEvent) => {
    cancelEvent(ev);
    if (this.props.fSelected) {
      this.props.changeSelectedKey(null);
    }
    mutate({
      description: 'Click on Delete key',
      environment: this.props.relay.environment,
      mutationOptions: updateKey({
        theKey: this.props.theKey,
        attrs: { isDeleted: true },
      }),
    });
  };
}

// ------------------------------------------
// Styles
// ------------------------------------------
const style = {
  row: fSelected =>
    flexItem(
      'none',
      flexContainer('row', {
        minHeight: 21,
        maxHeight: fSelected ? undefined : 100,
        overflowY: fSelected ? undefined : 'hidden',
      })
    ),
  bodyCell: {
    position: 'relative',
    paddingTop: 1,
    paddingBottom: 1,
    borderBottom: `1px solid ${COLORS.dark}`,
  },
  keyCell: {
    paddingRight: 17,
  },
  selected: base =>
    timm.merge(base, {
      backgroundColor: COLORS.medium,
    }),
  unused: base =>
    timm.merge(base, {
      color: COLORS.dim,
    }),
  untranslated: base =>
    timm.merge(base, {
      backgroundColor: COLORS.mediumAlt,
    }),
  context: {
    fontWeight: 900,
    marginRight: 10,
  },
  text: {
    whiteSpace: 'pre-wrap',
  },
  removeIcon: {
    position: 'absolute',
    top: 3,
    right: 5,
    color: 'black',
  },
};

// ==========================================
// Public API
// ==========================================
const HoverableTranslatorRow = hoverable(TranslatorRow);
const Container = Relay.createFragmentContainer(
  HoverableTranslatorRow,
  gqlFragments
);

// Wrap the Relay container in a PureComponent,
// so it only gets rendered when necessary (e.g. not when
// changing the selected row)
class SuperContainer extends React.PureComponent {
  render() {
    return <Container {...this.props} />;
  }
}
export default SuperContainer;
export { HoverableTranslatorRow as _HoverableTranslatorRow };
