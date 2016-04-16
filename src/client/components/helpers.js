import timm                 from 'timm';
import Relay                from 'react-relay';
import { mainStory }        from 'storyboard';

export function bindAll(_this, fnNames) {
  for (const name of fnNames) {
    _this[name] = _this[name].bind(_this);
  }
}

export function flexItem(flex, style) {
  return timm.merge({
    flex,
    WebkitFlex: flex,
  }, style);
}

export function flexContainer(flexDirection, style) {
  return timm.merge({
    display: 'flex',
    flexDirection,
  }, style);
}

export function cancelEvent(ev) {
  ev.preventDefault();
  ev.stopPropagation();
}

// Runs a Relay mutation inside a Storyboard story
export function mutate(options) {
  const {
    description,
    Mutation,
    props,
    onFailure,
    onSuccess,
  } = options;
  const story = mainStory.child({
    src: 'views',
    title: description,
  });
  const finalProps = timm.set(props, 'storyId', story.storyId);
  const mutation = new Mutation(finalProps);
  Relay.Store.commitUpdate(mutation, {
    onFailure: transaction => {
      const error = transaction.getError() || new Error('Mutation failed');
      story.error('views', 'Transaction error:', { attach: error });
      story.close();
      if (onFailure) onFailure(transaction);
    },
    onSuccess: response => {
      story.debug('views', 'Transaction result:', {
        attach: response,
        attachLevel: 'trace',
      });
      story.close();
      if (onSuccess) onSuccess(response);
    },
  });
}
