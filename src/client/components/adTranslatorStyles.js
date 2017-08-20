import { flexItem } from 'giu';
import { COLORS } from '../gral/constants';

const TRANSLATOR_GUTTER = 5;

const styleKeyCol = flexItem('1 1 0px', {
  backgroundColor: COLORS.light,
  marginRight: TRANSLATOR_GUTTER,
  paddingLeft: 5,
  paddingRight: 17,
});

const styleLangCol = flexItem('1 1 0px', {
  backgroundColor: COLORS.light,
  marginRight: TRANSLATOR_GUTTER,
  paddingLeft: 5,
  paddingRight: 5,
});

export { styleKeyCol, styleLangCol, TRANSLATOR_GUTTER };
