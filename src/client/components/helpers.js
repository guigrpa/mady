import timm                 from 'timm';
import Relay                from 'react-relay';
import { mainStory }        from 'storyboard';
import { notify }           from 'giu';
import _t                   from '../../translate';

// Runs a Relay mutation inside a Storyboard story
function mutate(options) {
  const {
    description,
    Mutation,
    props,
    onFailure, onSuccess, onFinish,
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
      if (onFailure) {
        onFailure(transaction);
      } else {
        notify({
          title: _t('error_Changes could not be saved'),
          msg: _t('error_Is the server running?'),
          type: 'error',
          icon: 'save',
        });
      }
      if (onFinish) onFinish();
    },
    onSuccess: response => {
      story.debug('views', 'Transaction result:', {
        attach: response,
        attachLevel: 'trace',
      });
      story.close();
      if (onSuccess) onSuccess(response);
      if (onFinish) onFinish();
    },
  });
}

export {
  mutate,
};
