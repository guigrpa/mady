// @flow

import chokidar from 'chokidar';
import { mainStory, chalk } from 'storyboard';

let watcher;

type Options = {|
  paths: Array<string>,
  onEvent: (eventType: string, filePath: string) => any,
|};

const init = ({ paths, onEvent }: Options) => {
  shutDown();
  watcher = chokidar.watch(paths, {
    ignored: /[/\\]\./,
    ignoreInitial: true,
  });
  mainStory.info('watch', `Watching: ${chalk.cyan.bold(paths.join(', '))}`);
  ['change', 'add', 'unlink'].forEach(type => {
    if (!watcher) return;
    watcher.on(type, filePath => {
      mainStory.info(
        'watch',
        `${chalk.cyan.bold(type.toUpperCase())} on ${chalk.cyan.bold(filePath)}`
      );
      onEvent(type, filePath);
    });
  });
};

const shutDown = () => {
  if (watcher) watcher.close();
  watcher = null;
};

// =============================================
// Public
// =============================================
export { init, shutDown };
