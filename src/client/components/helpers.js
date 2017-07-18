// @flow

import { setIn } from 'timm';
import { commitMutation } from 'react-relay';
import { mainStory } from 'storyboard';
import { notify } from 'giu';
import _t from '../../translate';
import relayEnvironment from '../gral/relayEnvironment';

// Runs a Relay mutation inside a Storyboard story
const mutate = ({
  description,
  mutationOptions: mutationOptions0,
  onFailure,
  onSuccess,
  onFinish,
}: {|
  description: string,
  mutation: Function,
  input?: Object,
  onFailure?: (failure: Object) => void,
  onSuccess?: (response: Object) => void,
  onFinish?: () => void,
|}) => {
  const story = mainStory.child({
    src: 'views',
    title: description,
  });
  let mutationOptions = mutationOptions0;
  mutationOptions = setIn(
    mutationOptions,
    ['variables', 'input', 'storyId'],
    story.storyId
  );
  commitMutation(relayEnvironment, {
    ...mutationOptions,
    onCompleted: response => {
      story.debug('views', 'Transaction result:', {
        attach: response,
        attachLevel: 'trace',
      });
      tearDown(story);
      if (onSuccess) onSuccess(response);
      if (onFinish) onFinish();
    },
    onError: err => {
      const error = err.message || new Error('Mutation failed');
      story.error('views', 'Transaction error:', { attach: error });
      tearDown(story);
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

const tearDown = story => {
  story.close();
};

// ===================================================
// Public
// ===================================================
export { mutate };
