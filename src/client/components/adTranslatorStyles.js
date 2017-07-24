import { flexItem } from 'giu';
import { COLORS } from '../gral/constants';

const styleKeyCol = flexItem('1 1 0px', {
  backgroundColor: COLORS.light,
  marginRight: 5,
  paddingLeft: 5,
  paddingRight: 17,
});

const styleLangCol = flexItem('1 1 0px', {
  backgroundColor: COLORS.light,
  marginRight: 5,
  paddingLeft: 5,
  paddingRight: 5,
});

export { styleKeyCol, styleLangCol };
