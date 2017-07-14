// @flow

import { set as timmSet } from 'timm';
import { commitMutation } from 'react-relay';
import { mainStory } from 'storyboard';
import { notify } from 'giu';
import _t from '../../translate';
import relayEnvironment from '../gral/relayEnvironment';

// Runs a Relay mutation inside a Storyboard story
const mutate = ({
  description,
  mutation,
  input = {},
  configs,
  onFailure,
  onSuccess,
  onFinish,
}: {|
  description: string,
  mutation: Function,
  input?: Object,
  configs?: Array<Object>,
  onFailure?: (failure: Object) => void,
  onSuccess?: (response: Object) => void,
  onFinish?: () => void,
|}) => {
  const story = mainStory.child({
    src: 'views',
    title: description,
  });
  const finalInput = timmSet(input, 'storyId', story.storyId);
  commitMutation(relayEnvironment, {
    mutation,
    variables: { input: finalInput },
    configs,
    onCompleted: response => {
      story.debug('views', 'Transaction result:', {
        attach: response,
        attachLevel: 'trace',
      });
      story.close();
      if (onSuccess) onSuccess(response);
      if (onFinish) onFinish();
    },
    onError: err => {
      const error = err.message || new Error('Mutation failed');
      story.error('views', 'Transaction error:', { attach: error });
      story.close();
      if (onFailure) {
        onFailure(err);
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
  });
};

export { mutate };
